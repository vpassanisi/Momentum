import type Koa from "koa";
import type { Db } from "mongodb";

export interface registerBody {
  name: string;
  email: string;
  password: string;
}

export interface loginBody {
  email: string;
  password: string;
}

export interface meBody {
  token: string;
}

export async function register(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, { db: Db }>,
  next: Koa.Next
) {
  const { name, email, password } = ctx.request.body as registerBody;

  if (!name && typeof name === "string") {
    ctx.throw(400, "user must provide a name");
  }
  if (!email && typeof email === "string") {
    ctx.throw(400, "user must provide an email");
  }
  if (!password && typeof password === "string") {
    ctx.throw(400, "user must provide a password");
  }

  await next();
}

export async function login(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, { db: Db }>,
  next: Koa.Next
) {
  const { email, password } = ctx.request.body as loginBody;

  if (!email && typeof email === "string") {
    ctx.throw(400, "user must provide an email");
  }
  if (!password && typeof password === "string") {
    ctx.throw(400, "user must provide a password");
  }

  await next();
}

export async function me(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, { db: Db }>,
  next: Koa.Next
) {
  const { token } = ctx.request.body as meBody;

  if (!token && typeof token === "string") {
    ctx.throw(400, "user must provide a password");
  }

  await next();
}
