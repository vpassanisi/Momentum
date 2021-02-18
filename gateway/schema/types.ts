import { GraphQLObjectType, GraphQLString, GraphQLInt, graphql } from "graphql";

export interface registerRes {
  token: string;
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}
export interface loginRes {
  token: string;
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}
export interface meRes {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface subsRes {
  _id: string;
  name: string;
  description: string;
  founder: string;
  createdat: string;
  banner: string;
  icon: string;
  colorPrimary: string;
  colorPrimaryLight: string;
  colorPrimaryDark: string;
}

const userReturnType = new GraphQLObjectType({
  name: "userReturnType",
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
  },
});

const subsReturnType = new GraphQLObjectType({
  name: "subsReturnType",
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    founder: { type: GraphQLString },
    createdat: { type: GraphQLString },
    banner: { type: GraphQLString },
    icon: { type: GraphQLString },
    colorPrimary: { type: GraphQLString },
    colorPrimaryLight: { type: GraphQLString },
    colorPrimaryDark: { type: GraphQLString },
  },
});

export { userReturnType, subsReturnType };
