import type Koa from "koa";
import { NewUser, MongoUser, UserType, TokenPayload } from "./models";
import type { registerBody, loginBody } from "../util/reqValidator";
import type { Db, WithId } from "mongodb";
import jwt from "jsonwebtoken";
import { env } from "../util/envValidator";

export async function register(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, { db: Db }>
) {
  const body = ctx.request.body as registerBody;

  const newUser = new NewUser(body);
  await newUser.encrypt(10);

  const res = await ctx.db
    .collection<UserType>("Users")
    .insertOne(newUser.getNewUser());

  const user = new MongoUser(res.ops[0]);

  ctx.body = user.userResponse();
}

export async function login(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, { db: Db }>
) {
  const { email, password } = ctx.request.body as loginBody;

  const res = await ctx.db
    .collection<WithId<UserType>>("Users")
    .findOne({ email });

  if (res === null) ctx.throw(400, "no user");

  const user = new MongoUser(res);

  const matchPass = await user.checkPassword(password);

  user.updateLastLogin();

  await ctx.db
    .collection<WithId<UserType>>("Users")
    .updateOne({ _id: user._id }, { $set: { lastLogin: user.lastLogin } });

  if (!matchPass) ctx.throw(401, "Unauthorized");

  ctx.body = user.userResponse();
}

export async function me(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, { db: Db }>
) {
  const { token } = ctx.request.body;

  const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

  const res = await ctx.db
    .collection<WithId<UserType>>("Users")
    .findOne({ email: decoded.email });

  if (res === null) ctx.throw(401, "nice try :)");

  const user = new MongoUser(res);

  ctx.body = user.meRes();
}
