import Koa from "koa";
import KoaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import { handleErrors } from "./util/handleErrors";
import { env } from "./util/envValidator";
import mongo from "koa-mongo";
import * as Users from "./controller/users";
import * as Validate from "./util/reqValidator";

const app = new Koa();
const router = new KoaRouter();

app.use(handleErrors);
app.use(bodyParser());

app.use(
  mongo(
    { uri: env.MONGO_URI, db: env.MONGO_DB, max: 100, min: 1 },
    { useUnifiedTopology: true }
  )
);

router.post("/register", Validate.register, Users.register);
router.post("/login", Validate.login, Users.login);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env.PORT, async () => {
  console.log(
    "\x1b[35m%s\x1b[0m",
    `Users service is running on port ${env.PORT}`
  );
});
