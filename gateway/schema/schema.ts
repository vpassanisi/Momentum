import fetch from "node-fetch";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
} from "graphql";
import {
  meRes,
  subsRes,
  subsReturnType,
  userReturnType,
  postType,
  commentType,
  pointsType,
} from "./types";
import { env } from "../util/envValidator";

import type { registerRes, loginRes } from "./types";
import type { SetOption } from "cookies";
import type Koa from "koa";

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "query",
    fields: {
      login: {
        type: userReturnType,
        args: {
          email: { type: GraphQLNonNull(GraphQLString) },
          password: { type: GraphQLNonNull(GraphQLString) },
        },
        async resolve(parent, args, ctx: Koa.Context) {
          const res = await fetch("http://users:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = (await res.json()) as loginRes;

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
      logOut: {
        type: GraphQLBoolean,
        async resolve(parent, info, ctx) {
          let options: SetOption = {
            expires: new Date(Date.now() + 30),
            httpOnly: true,
            sameSite: "strict",
          };

          if (env.NODE_ENV === "production") options.secure = true;

          ctx.cookies.set("token", "", options);

          return true;
        },
      },
      me: {
        type: userReturnType,
        async resolve(parent, args, ctx) {
          const token = ctx.cookies.get("token");
          if (!token) return ctx.throw("not logged in");

          const res = await fetch("http://users:5000/me", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (!res.ok) throw Error(await res.text());

          const json = (await res.json()) as meRes;

          return json;
        },
      },
      subs: {
        type: GraphQLNonNull(GraphQLList(subsReturnType)),
        args: {
          name: { type: GraphQLString },
          order: { type: GraphQLInt },
          by: { type: GraphQLString },
        },
        async resolve(parent, args, ctx, info) {
          const res = await fetch("http://subs:5000/subs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = (await res.json()) as subsRes;

          return json;
        },
      },
      post: {
        type: postType,
        args: {
          ID: { type: GraphQLNonNull(GraphQLString) },
        },
        async resolve(parent, args, ctx, info) {
          const res = await fetch("http://posts:5000/onePost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

          return json;
        },
      },
      points: {
        type: GraphQLNonNull(GraphQLString),
        args: {
          targetIDs: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
        },
        async resolve(parent, args, ctx, info) {
          const token = ctx.cookies.get("token");
          if (!token) throw Error("not logged in");

          args.token = token;

          const res = await fetch("http://points:5000/points", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

          return JSON.stringify(json);
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "mutation",
    fields: {
      register: {
        type: userReturnType,
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          email: { type: GraphQLNonNull(GraphQLString) },
          password: { type: GraphQLNonNull(GraphQLString) },
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
      // increment: {

      // }
    },
  }),
  types: [commentType, postType],
});

export { schema };
