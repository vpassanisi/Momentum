import fetch from "node-fetch";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { registerReturnType, loginReturnType } from "./types";
import { env } from "../util/envValidator";

import type { registerRes, loginRes } from "./types";
import type { SetOption } from "cookies";
import type Koa from "koa";

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "query",
    fields: {
      login: {
        type: loginReturnType,
        args: {
          email: { type: GraphQLString },
          password: { type: GraphQLString },
        },
        async resolve(parent, args, ctx: Koa.Context) {
          const res = await fetch("http://users:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          let json = (await res.json()) as loginRes;

          let options: SetOption = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "strict",
          };

          if (env.NODE_ENV === "production") options.secure = true;

          ctx.cookies.set("token", json.token, options);

          return json;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "mutation",
    fields: {
      register: {
        type: registerReturnType,
        args: {
          name: { type: GraphQLString },
          email: { type: GraphQLString },
          password: { type: GraphQLString },
        },
        async resolve(parent, args, ctx: Koa.Context) {
          const res = await fetch("http://users:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = (await res.json()) as registerRes;

          let options: SetOption = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "strict",
          };

          if (env.NODE_ENV === "production") options.secure = true;

          ctx.cookies.set("token", json.token, options);

          return json;
        },
      },
    },
  }),
});

export { schema };
