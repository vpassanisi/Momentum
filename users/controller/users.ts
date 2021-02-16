import faunadb, {query as q, values} from "faunadb"
import type Koa from "koa"
import { NewUser, FaunaUserRes } from "./models"
import type {registerBody} from "../util/reqValidator"


export async function register(ctx: Koa.ParameterizedContext<Koa.DefaultState, {fdb: faunadb.Client}>) {
    const body = ctx.request.body as registerBody

    const u = new NewUser(body)
    await u.encrypt(10)
    const encryptedUser = u.getUser()

    const res = await ctx.fdb.query<values.Document<typeof encryptedUser>>(
        q.Create(
            q.Collection('Users'),
            {data: encryptedUser}
        )
    )

    return ctx.body = new FaunaUserRes(res).userResponse()
}