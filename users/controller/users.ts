import type Koa from "koa";
import { NewUser, MongoUserType, MongoUser } from "./models";
import type { registerBody, loginBody } from "../util/reqValidator";
import type { Db, InsertOneWriteOpResult } from "mongodb";

export async function register(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, { db: Db }>
) {
  const body = ctx.request.body as registerBody;

  const u = new NewUser(body);
  await u.encrypt(10);

  const x = (await ctx.db
    .collection("Users")
    .insertOne(u.getNewUser())) as InsertOneWriteOpResult<MongoUserType>;

  const user = new MongoUser(x.ops[0]);

  ctx.body = user.userResponse();
}

export async function login(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, { db: Db }>
) {
  const { email, password } = ctx.request.body as loginBody;

  const x = (await ctx.db
    .collection("Users")
    .findOne({ email })) as MongoUserType;

  const oldUser = new MongoUser(x);

  console.log(await oldUser.checkPassword(password));

  return {
    name: "test",
    email: "test",
  };
}
