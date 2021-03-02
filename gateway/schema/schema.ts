import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLScalarType,
  GraphQLNonNull,
  GraphQLBoolean,
} from "graphql";
import fetch from "node-fetch";
import type { SetOption } from "cookies";
import { env } from "../util/envValidator";

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "query",
    fields: {
      subs: {
        type: GraphQLNonNull(
          GraphQLList(
            new GraphQLObjectType({
              name: "subType",
              fields: {
                _id: { type: GraphQLString },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                createdAt: { type: GraphQLInt },
                banner: { type: GraphQLString },
                icon: { type: GraphQLString },
                colorPrimary: { type: GraphQLString },
                colorPrimaryLight: { type: GraphQLString },
                colorPrimaryDark: { type: GraphQLString },
                posts: {
                  type: GraphQLList(
                    new GraphQLObjectType({
                      name: "postType",
                      fields: {
                        _id: { type: GraphQLString },
                        title: { type: GraphQLString },
                        body: { type: GraphQLString },
                        points: { type: GraphQLInt },
                        sub: { type: GraphQLString },
                        createdAt: { type: GraphQLInt },
                        user: {
                          type: new GraphQLObjectType({
                            name: "userType",
                            fields: {
                              _id: { type: GraphQLString },
                              name: { type: GraphQLString },
                              createdAt: { type: GraphQLString },
                            },
                          }),
                        },
                        commentsMap: {
                          type: GraphQLNonNull(
                            new GraphQLScalarType({
                              name: "commentsMapScalar",
                              serialize: (val) =>
                                typeof val === "object" ? val : {},
                            })
                          ),
                          args: {
                            sortBy: { type: GraphQLNonNull(GraphQLString) },
                            order: { type: GraphQLNonNull(GraphQLInt) },
                            lastValue: { type: GraphQLNonNull(GraphQLInt) },
                            lastCreatedAt: { type: GraphQLNonNull(GraphQLInt) },
                          },
                          async resolve(parent, args, ctx, info) {
                            args.postID = parent._id;
                            const res = await fetch(
                              "http://comments:5000/commentsMap",
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(args),
                              }
                            );

                            if (!res.ok) throw Error(await res.text());

                            const json = await res.json();

                            return json;
                          },
                        },
                      },
                    })
                  ),
                  args: {
                    sortBy: { type: GraphQLString },
                    order: { type: GraphQLInt },
                    lastVal: { type: GraphQLInt },
                    postID: { type: GraphQLString },
                  },
                  async resolve(parent, args, ctx, info) {
                    args.sub = parent._id;

                    const res = await fetch("http://posts:5000/posts", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(args),
                    });

                    if (!res.ok) throw Error(await res.text());

                    const json = await res.json();

                    return json;
                  },
                },
              },
            })
          )
        ),
        args: {
          name: { type: GraphQLString },
        },
        async resolve(parent, args, ctx, info) {
          const res = await fetch("http://subs:5000/subs", {
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
      login: {
        type: new GraphQLObjectType({
          name: "loginReturnType",
          fields: {
            _id: { type: GraphQLString },
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            createdAt: { type: GraphQLInt },
          },
        }),
        args: {
          email: { type: GraphQLNonNull(GraphQLString) },
          password: { type: GraphQLNonNull(GraphQLString) },
        },
        async resolve(parent, args, ctx, info) {
          const res = await fetch("http://users:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

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
        type: new GraphQLObjectType({
          name: "meReturnType",
          fields: {
            _id: { type: GraphQLString },
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            createdAt: { type: GraphQLInt },
          },
        }),
        async resolve(parent, args, ctx) {
          const token = ctx.cookies.get("token");
          if (!token) return ctx.throw("not logged in");

          const res = await fetch("http://users:5000/me", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

          return json;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "mutation",
    fields: {
      register: {
        type: new GraphQLObjectType({
          name: "registerReturnType",
          fields: {
            _id: { type: GraphQLString },
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            createdAt: { type: GraphQLInt },
          },
        }),
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          email: { type: GraphQLNonNull(GraphQLString) },
          password: { type: GraphQLNonNull(GraphQLString) },
        },
        async resolve(parent, args, ctx, info) {
          const res = await fetch("http://users:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

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
      increment: {
        type: new GraphQLObjectType({
          name: "incrementReturnType",
          fields: {
            post: {
              type: new GraphQLObjectType({
                name: "incrementPostReturnType",
                fields: {
                  _id: { type: GraphQLString },
                  title: { type: GraphQLString },
                  body: { type: GraphQLString },
                  points: { type: GraphQLInt },
                  sub: { type: GraphQLString },
                  createdAt: { type: GraphQLInt },
                },
              }),
            },
            comment: {
              type: new GraphQLObjectType({
                name: "incrementCommentReturnType",
                fields: {
                  _id: { type: GraphQLString },
                  body: { type: GraphQLString },
                  points: { type: GraphQLInt },
                  post: { type: GraphQLString },
                  parent: { type: GraphQLString },
                  root: { type: GraphQLString },
                  createdAt: { type: GraphQLString },
                },
              }),
            },
          },
        }),
        args: {
          postID: { type: GraphQLString },
          commentID: { type: GraphQLString },
        },
        async resolve(parent, args, ctx, info) {
          if (args.postID && args.commentID)
            throw Error("either postID or commentID");

          if (!args.postID && !args.commentID)
            throw Error("either postID or commentID");

          const token = ctx.cookies.get("token");
          if (!token) throw Error("Unauthorized");

          args.token = token;

          const res = await fetch("http://points:5000/increment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

          return json;
        },
      },
      decrement: {
        type: new GraphQLObjectType({
          name: "decrementReturnType",
          fields: {
            post: {
              type: new GraphQLObjectType({
                name: "decrementPostReturnType",
                fields: {
                  _id: { type: GraphQLString },
                  title: { type: GraphQLString },
                  body: { type: GraphQLString },
                  points: { type: GraphQLInt },
                  sub: { type: GraphQLString },
                  createdAt: { type: GraphQLInt },
                },
              }),
            },
            comment: {
              type: new GraphQLObjectType({
                name: "decrementCommentReturnType",
                fields: {
                  _id: { type: GraphQLString },
                  body: { type: GraphQLString },
                  points: { type: GraphQLInt },
                  post: { type: GraphQLString },
                  parent: { type: GraphQLString },
                  root: { type: GraphQLString },
                  createdAt: { type: GraphQLString },
                },
              }),
            },
          },
        }),
        args: {
          postID: { type: GraphQLString },
          commentID: { type: GraphQLString },
        },
        async resolve(parent, args, ctx, info) {
          if (args.postID && args.commentID)
            throw Error("either postID or commentID");

          if (!args.postID && !args.commentID)
            throw Error("either postID or commentID");

          const token = ctx.cookies.get("token");
          if (!token) throw Error("Unauthorized");

          args.token = token;

          const res = await fetch("http://points:5000/decrement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

          return json;
        },
      },
      remove: {
        type: new GraphQLObjectType({
          name: "removeReturnType",
          fields: {
            post: {
              type: new GraphQLObjectType({
                name: "removePostReturnType",
                fields: {
                  _id: { type: GraphQLString },
                  title: { type: GraphQLString },
                  body: { type: GraphQLString },
                  points: { type: GraphQLInt },
                  sub: { type: GraphQLString },
                  createdAt: { type: GraphQLInt },
                },
              }),
            },
            comment: {
              type: new GraphQLObjectType({
                name: "removeCommentReturnType",
                fields: {
                  _id: { type: GraphQLString },
                  body: { type: GraphQLString },
                  points: { type: GraphQLInt },
                  post: { type: GraphQLString },
                  parent: { type: GraphQLString },
                  root: { type: GraphQLString },
                  createdAt: { type: GraphQLString },
                },
              }),
            },
          },
        }),
        args: {
          postID: { type: GraphQLString },
          commentID: { type: GraphQLString },
        },
        async resolve(parent, args, ctx, info) {
          if (args.postID && args.commentID)
            throw Error("either postID or commentID");

          if (!args.postID && !args.commentID)
            throw Error("either postID or commentID");

          const token = ctx.cookies.get("token");
          if (!token) throw Error("Unauthorized");

          args.token = token;

          const res = await fetch("http://points:5000/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

          return json;
        },
      },
      newComment: {
        type: GraphQLNonNull(
          new GraphQLObjectType({
            name: "newCommentReturnType",
            fields: {
              _id: { type: GraphQLString },
              body: { type: GraphQLString },
              points: { type: GraphQLInt },
              user: {
                type: new GraphQLObjectType({
                  name: "comemntUser",
                  fields: {
                    name: { type: GraphQLString },
                  },
                }),
              },
              post: { type: GraphQLString },
              parent: { type: GraphQLString },
              root: { type: GraphQLString },
              createdAt: { type: GraphQLString },
            },
          })
        ),
        args: {
          postID: { type: GraphQLNonNull(GraphQLString) },
          parentID: { type: GraphQLNonNull(GraphQLString) },
          rootID: { type: GraphQLNonNull(GraphQLString) },
          body: { type: GraphQLNonNull(GraphQLString) },
        },
        async resolve(parent, args, ctx, info) {
          const token = ctx.cookies.get("token");
          if (!token) throw Error("Unauthorized");

          args.token = token;

          const res = await fetch("http://comments:5000/newComment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

          return json;
        },
      },
      newPost: {
        type: GraphQLNonNull(
          new GraphQLObjectType({
            name: "newPostReturnType",
            fields: {
              postID: { type: GraphQLString },
            },
          })
        ),
        args: {
          title: { type: GraphQLString },
          body: { type: GraphQLString },
          subID: { type: GraphQLString },
        },
        async resolve(parent, args, ctx, info) {
          const token = ctx.cookies.get("token");
          if (!token) throw Error("Unauthorized");

          args.token = token;

          const res = await fetch("http://posts:5000/newPost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(args),
          });

          if (!res.ok) throw Error(await res.text());

          const json = await res.json();

          return json;
        },
      },
    },
  }),
});

export { schema };
