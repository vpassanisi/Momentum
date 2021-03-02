import Koa from "koa";
import KoaRouter from "koa-router";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import graphqlHTTP from "koa-graphql";
import { schema } from "./schema/schema";
import { env } from "./util/envValidator";

const app = new Koa();
const router = new KoaRouter();

app.use(cors());

app.use(bodyParser());

router.all("/gql", graphqlHTTP({ schema: schema, graphiql: true }));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env.PORT, () =>
  console.log(
    "\x1b[35m%s\x1b[0m",
    `Running GraphQL server on port ${env.PORT} and everything is happy and good :)`
  )
);
