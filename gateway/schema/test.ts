import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLScalarType,
  GraphQLNonNull,
} from "graphql";

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
                          type: new GraphQLScalarType({
                            name: "commentsMapScalar",
                            serialize: (val) => val,
                          }),
                        },
                      },
                    })
                  ),
                  args: {
                    sortBy: { type: GraphQLString },
                    order: { type: GraphQLInt },
                    lastVal: { type: GraphQLInt },
                  },
                  async resolve(parent, args, ctx, info) {
                    args.sub = parent._id;

                    const res = await fetch("http://posts:5000/Post", {
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
    },
  }),
});
