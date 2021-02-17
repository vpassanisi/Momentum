import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

export interface registerRes {
  token: string;
  name: string;
  email: string;
  createdAt: string;
}
export interface loginRes {
  token: string;
  name: string;
  email: string;
  createdAt: string;
}

const registerReturnType = new GraphQLObjectType({
  name: "registerReturnType",
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
  },
});
const loginReturnType = new GraphQLObjectType({
  name: "loginReturnType",
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
  },
});

export { registerReturnType, loginReturnType };
