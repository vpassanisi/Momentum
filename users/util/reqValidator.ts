import type Koa from "koa"
import type f from "faunadb"

export interface registerBody {
    name: string,
    email: string,
    password: string
}

export async function register(ctx: Koa.ParameterizedContext<Koa.DefaultState, {fdb: f.Client}>, next: Koa.Next) {
    const {name, email, password} = ctx.request.body as registerBody

    if(!name) ctx.throw(400, "user must provide a name")
    if(!email) ctx.throw(400, "user must provide an email")
    if(!password) ctx.throw(400, "user must provide a password")

    await next()
}