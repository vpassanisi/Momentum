import Koa from "koa";
import KoaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import {handleErrors} from "./util/handleErrors"
import {env} from "./util/envValidator"
import * as f from "faunadb"
import * as Users from "./controller/users"
import * as Validate from "./util/reqValidator"

const client: f.Client = new f.Client({secret: env.FDB_SECRET, keepAlive: true})

const app = new Koa();
const router = new KoaRouter();

app.use(handleErrors)
app.use(bodyParser());
app.use(async (ctx: Koa.ParameterizedContext<Koa.DefaultState, {fdb: f.Client}>, next: Koa.Next) => {
  ctx.fdb = client
  await next()
})

router.post("/register", Validate.register, Users.register)

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env.PORT, async () => {
  console.log(
    "\x1b[35m%s\x1b[0m",
    `Users service is running on port ${env.PORT}`
  );
});