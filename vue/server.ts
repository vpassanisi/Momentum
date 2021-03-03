import Koa from "koa";
import serve from "koa-static";
import { handleErrors } from "./util/handleErrors";
import { env } from "./util/envValidator";

const app = new Koa();

app.use(handleErrors);

app.use(
  serve(
    __dirname + `${env.NODE_ENV === "development" ? "/client/dist" : "/client"}`
  )
);

app.listen(env.PORT, async () => {
  console.log(
    "\x1b[35m%s\x1b[0m",
    `Client service is running on port ${env.PORT}`
  );
});
