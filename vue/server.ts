import Koa from "koa";
import serve from "koa-static";
import util from "util";
import fs from "fs";
import path from "path";
import { handleErrors } from "./util/handleErrors";
import { env } from "./util/envValidator";

const readFile = util.promisify(fs.readFile);

const app = new Koa();

app.use(handleErrors);

app.use(
  serve(
    __dirname + `${env.NODE_ENV === "development" ? "/client/dist" : "/client"}`
  )
);

app.use(async (ctx) => {
  ctx.set("Content-Type", "text/html");
  ctx.body = await readFile(path.join(__dirname, "./client/index.html"));
});

app.listen(env.PORT, async () => {
  console.log(
    "\x1b[35m%s\x1b[0m",
    `Client service is running on port ${env.PORT}`
  );
});
