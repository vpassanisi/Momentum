import fetch from "node-fetch";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} from "graphql";
import { PossibleFragmentSpreads } from "graphql/validation/rules/PossibleFragmentSpreads";

export interface postsBody {
  sub: string;
  by?: string;
  order?: number;
}

export interface registerRes {
  token: string;
  _id: string;
  name: string;
  email: string;
  createdAt: number;
}
export interface loginRes {
  token: string;
  _id: string;
  name: string;
  email: string;
  createdAt: number;
}
export interface meRes {
  _id: string;
  name: string;
  email: string;
  createdAt: number;
}

export interface subsRes {
  _id: string;
  name: string;
  description: string;
  founder: string;
  createdAt: number;
  banner: string;
  icon: string;
  colorPrimary: string;
  colorPrimaryLight: string;
  colorPrimaryDark: string;
}

interface comment {
  _id: string;
  body: string;
  points: number;
  user: string;
  post: string;
  parent: string;
  root: string;
  createdAt: number;
  comments: Array<comment>;
}

// ts doesn't know that graphql will resolve the type at run time :(
// @ts-expect-error
const commentType = new GraphQLObjectType({
  name: "commentType",
  fields: () => ({
    _id: { type: GraphQLString },
    body: { type: GraphQLString },
    points: { type: GraphQLInt },
    user: { type: GraphQLString },
    post: { type: GraphQLString },
    parent: { type: GraphQLString },
    root: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    comments: {
      type: new GraphQLList(commentType),
    },
  }),
});

const orderEnumType = new GraphQLEnumType({
  name: "orderEnumType",
  values: {
    asc: { value: 1 },
    desc: { value: -1 },
  },
});

const userReturnType = new GraphQLObjectType({
  name: "userReturnType",
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
  },
});

const postType = new GraphQLObjectType({
  name: "postType",
  fields: {
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    points: { type: GraphQLInt },
    user: { type: GraphQLString },
    sub: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    comments: {
      type: GraphQLNonNull(GraphQLList(commentType)),
      async resolve(parent, args, ctx, info) {
        const body = {
          postID: parent._id,
          by: "points",
          lastValue: 0,
          lastCreatedAt: 0,
        };
        const res = await fetch("http://comments:5000/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw Error(await res.text());

        const json = await res.json();

        return json;
      },
    },
  },
});

const subsReturnType = new GraphQLObjectType({
  name: "subsReturnType",
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    founder: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    banner: { type: GraphQLString },
    icon: { type: GraphQLString },
    colorPrimary: { type: GraphQLString },
    colorPrimaryLight: { type: GraphQLString },
    colorPrimaryDark: { type: GraphQLString },
    posts: {
      type: GraphQLNonNull(GraphQLList(postType)),
      args: {
        by: { type: GraphQLString },
        order: { type: orderEnumType },
      },
      async resolve(parent, args, ctx) {
        let body: postsBody = { sub: parent._id };
        if (args.by) body.by = args.by;
        if (args.order) body.order = args.order;

        const res = await fetch("http://posts:5000/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw Error(await res.text());

        const json = await res.json();

        return json;
      },
    },
  },
});

export { userReturnType, subsReturnType, postType, commentType };
