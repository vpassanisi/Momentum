/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-use-before-define */

import router from "@/router";
import { defineModule } from "direct-vuex";
import { moduleActionContext } from "../index";
import { Sub, Comment, Post } from "./types";

const state = () => ({
  subs: [] as Sub[],
  moreComments: false,
  isLoading: false,
  error: "",
});

export type DataState = ReturnType<typeof state>;

const setColors = (sub: Sub) => {
  const colorsEl = document.getElementById("colors");
  if (
    !colorsEl ||
    !sub.colorPrimary ||
    !sub.colorPrimaryLight ||
    !sub.colorPrimaryDark
  )
    return;
  colorsEl.style.setProperty("--primary", sub.colorPrimary);
  colorsEl.style.setProperty("--primary-light", sub.colorPrimaryLight);
  colorsEl.style.setProperty("--primary-dark", sub.colorPrimaryDark);
};

const DataMod = defineModule({
  namespaced: true as true,
  state,
  getters: {
    targetIDs: function(state): string[] {
      const arr: string[] = [];
      const posts = state.subs[0]?.posts;
      const commentsMap = state.subs[0]?.posts?.[0]?.commentsMap;

      if (posts) {
        arr.push(...posts.map((post) => post._id));
      }

      if (commentsMap) {
        for (const key in commentsMap) {
          arr.push(key);
        }
      }

      return arr;
    },
    lastValueCreatedAt: function(state): number {
      const postID = state.subs[0]?.posts?.[0]?._id;

      if (!postID) return 0;

      const postArr = state.subs[0]?.posts?.[0]?.commentsMap?.[postID];

      if (!postArr) return 0;

      return postArr[postArr.length - 1].createdAt;
    },
    lastValuePoints: function(state): number {
      const postID = state.subs[0]?.posts?.[0]?._id;

      if (!postID) return 0;

      const postArr = state.subs[0]?.posts?.[0]?.commentsMap?.[postID];

      if (!postArr) return 0;

      return postArr[postArr.length - 1].points;
    },
  },
  actions: {
    async homeInit(context) {
      const { commit } = dataActionContext(context);
      commit.clearDataState();
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query {
                subs {
                _id
                name
                description
                banner
                icon
                createdAt
                colorPrimary
                colorPrimaryLight
                colorPrimaryDark
                }
            }`,
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const subs: Sub[] = data.subs;

        commit.setSubs(subs);
      } catch (error) {
        console.log(error.message);
        commit.error(error.message);
      }
      commit.endLoading();
    },
    async createPostInit(context, subName: string) {
      const { commit } = dataActionContext(context);
      commit.clearDataState();
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query Input($name: String) {
                subs(name: $name) {
                _id
                name
                description
                banner
                icon
                createdAt
                colorPrimary
                colorPrimaryLight
                colorPrimaryDark
                }
            }`,
            variables: {
              name: subName,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const subs: Sub[] = data.subs;

        commit.setSubs(subs);
        setColors(subs[0]);
      } catch (error) {
        console.log(error.message);
        commit.error(error.message);
      }
      commit.endLoading();
    },
    async createPost(
      context,
      x: { title: string; body: string; subID: string }
    ) {
      const { commit } = dataActionContext(context);
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
                  mutation Input($title: String, $body: String, $subID: String) {
                    newPost(title: $title, body: $body, subID: $subID) {
                      postID
                    }
                  }`,
            variables: {
              title: x.title,
              body: x.body,
              subID: x.subID,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const postID: string = data.newPost.postID;

        if (!postID) throw Error("failed to get new post ID");

        router.push(
          `/s/${router.currentRoute.value.params.sub}/comments/${postID}`
        );
      } catch (error) {
        console.log(error.message);
        commit.error(error.message);
      }
      commit.endLoading();
    },
    async createSub(
      context,
      x: {
        name: string;
        description: string;
        banner: string;
        icon: string;
        colorPrimary: string;
        colorPrimaryLight: string;
        colorPrimaryDark: string;
      }
    ) {
      const { commit } = dataActionContext(context);
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
                  mutation Input($name: String!, $description: String!, $banner: String!, $icon: String!, $colorPrimary: String!, $colorPrimaryLight: String!, $colorPrimaryDark: String!) {
                    newSub(name: $name, description: $description, banner: $banner, icon: $icon, colorPrimary: $colorPrimary, colorPrimaryLight: $colorPrimaryLight, colorPrimaryDark: $colorPrimaryDark) {
                      subName
                    }
                  }`,
            variables: {
              name: x.name,
              description: x.description,
              banner: x.banner,
              icon: x.icon,
              colorPrimary: x.colorPrimary,
              colorPrimaryLight: x.colorPrimaryLight,
              colorPrimaryDark: x.colorPrimaryDark,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const subName: string = data.newSub.subName;

        if (!subName) throw Error("failed to get new post ID");

        router.push(`/s/${subName}`);
      } catch (error) {
        console.log(error.message);
        commit.error(error.message);
      }
      commit.endLoading();
    },
    async subInit(
      context,
      x: { subName: string; sortBy: string; order: number }
    ) {
      const { commit } = dataActionContext(context);
      commit.clearDataState();
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query Input($name: String, $sortBy: String, $order: Int) {
                subs(name: $name) {
                _id
                name
                description
                banner
                icon
                createdAt
                colorPrimary
                colorPrimaryLight
                colorPrimaryDark
                posts(sortBy: $sortBy, order: $order) {
                    _id
                    title
                    body
                    points
                    sub
                    user{
                      name
                    }
                    createdAt
                    }
                }
            }`,
            variables: {
              name: x.subName,
              sortBy: x.sortBy,
              order: x.order,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const subs: Sub[] = data.subs;

        commit.setSubs(subs);
        setColors(subs[0]);
      } catch (error) {
        console.log(error.message);
        commit.error(error.message);
      }
      commit.endLoading();
    },
    async threadInit(
      context,
      x: {
        subName: string;
        postID: string;
        sortBy: string;
        order: number;
        lastValue: number;
        lastCreatedAt: number;
      }
    ) {
      const { commit } = dataActionContext(context);
      commit.clearDataState();
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query Input($name: String, $postID: String, $sortBy: String!, $order: Int!, $lastValue: Int!, $lastCreatedAt: Int!) {
                subs(name: $name) {
                _id
                name
                description
                banner
                icon
                createdAt
                colorPrimary
                colorPrimaryLight
                colorPrimaryDark
                posts(postID: $postID) {
                    _id
                    title
                    body
                    points
                    sub
                    user{
                      name
                    }
                    createdAt
                    commentsMap(sortBy: $sortBy, order: $order, lastValue: $lastValue, lastCreatedAt: $lastCreatedAt)
                    }
                }
            }`,
            variables: {
              name: x.subName,
              postID: x.postID,
              sortBy: x.sortBy,
              order: x.order,
              lastValue: x.lastValue,
              lastCreatedAt: x.lastCreatedAt,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const subs: Sub[] = data.subs;
        const commentsMap = subs?.[0]?.posts?.[0]?.commentsMap?.[x.postID];

        commit.setSubs(subs);
        setColors(subs[0]);

        if (commentsMap && commentsMap.length === 10) {
          commit.yesMoreComments();
        }
      } catch (error) {
        console.log(error.message);
        commit.error(error.message);
      }
      commit.endLoading();
    },
    newComment: async (
      context,
      obj: { postID: string; parentID: string; rootID: string; body: string }
    ) => {
      const { commit } = dataActionContext(context);
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
                mutation Input($postID: String!, $parentID: String!, $rootID: String!, $body: String!) {
                  newComment(postID: $postID, parentID: $parentID, rootID: $rootID, body: $body) {
                    _id
                    body
                    points
                    user {
                      name
                    }
                    post
                    parent
                    root
                    createdAt
                  }
                }`,
            variables: {
              postID: obj.postID,
              parentID: obj.parentID,
              rootID: obj.rootID,
              body: obj.body,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const comment: Comment = data.newComment;

        commit.addNewComment(comment);
      } catch (error) {
        console.error(error.message);
        commit.error(error.message);
      }
      commit.endLoading();
    },
    loadMoreComments: async (
      context,
      x: {
        subName: string;
        postID: string;
        sortBy: string;
        order: number;
        lastValue: number;
        lastCreatedAt: number;
      }
    ) => {
      const { commit } = dataActionContext(context);
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query Input($name: String, $postID: String, $sortBy: String!, $order: Int!, $lastValue: Int!, $lastCreatedAt: Int!) {
                  subs(name: $name) {
                    posts(postID: $postID) {
                      commentsMap(sortBy: $sortBy, order: $order, lastValue: $lastValue, lastCreatedAt: $lastCreatedAt)
                      }
                  }
              }`,
            variables: {
              name: x.subName,
              postID: x.postID,
              sortBy: x.sortBy,
              order: x.order,
              lastValue: x.lastValue,
              lastCreatedAt: x.lastCreatedAt,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const commentsMap: Record<string, Comment[]> =
          data.subs?.[0]?.posts?.[0]?.commentsMap;

        if (commentsMap && commentsMap[x.postID].length < 10) {
          commit.noMoreComments();
        }

        commit.addMoreComments(commentsMap);
      } catch (error) {
        console.log(error.message);
        commit.error(error.message);
      }
      commit.endLoading();
    },
  },
  mutations: {
    startLoading(state) {
      state.isLoading = true;
    },
    endLoading(state) {
      state.isLoading = false;
    },
    setSubs(state, subs: Sub[]) {
      state.subs = subs;
    },
    error(state, error: string) {
      state.error = error;
      setTimeout(() => (state.error = ""), 3000);
    },
    updatePostPoints(state, post: Post) {
      if (state.subs[0]?.posts) {
        const index = state.subs[0].posts.findIndex((v) => {
          return v._id === post._id;
        });

        state.subs[0].posts[index].points = post.points;
      }
    },
    updateCommentPoints: (state, comment: Comment) => {
      const i = state.subs[0]?.posts?.[0]?.commentsMap?.[
        comment.parent
      ].findIndex((v) => v._id === comment._id);

      const arr = state.subs[0]?.posts?.[0]?.commentsMap?.[comment.parent];

      if (typeof i === "number" && arr) arr[i].points = comment.points;
    },
    addNewComment: (state, newComment: Comment) => {
      const commentsMap = state.subs[0]?.posts?.[0]?.commentsMap;
      const post = state.subs[0]?.posts?.[0];

      if (!commentsMap || !post) return;

      if (!commentsMap[post._id]) {
        commentsMap[post._id] = [];
      }

      commentsMap[newComment._id] = [];

      commentsMap[newComment.parent] = [
        newComment,
        ...commentsMap[newComment.parent],
      ];
    },
    addMoreComments: (state, newComments: Record<string, Comment[]>) => {
      if (!state.subs[0]?.posts?.[0].commentsMap) return;
      const post = state.subs[0]?.posts?.[0];
      const commentsMap = post.commentsMap;
      if (!commentsMap) return;

      commentsMap[post._id] = commentsMap[post._id].concat(
        newComments[post._id]
      );

      delete newComments[post._id];

      state.subs[0].posts[0].commentsMap = { ...commentsMap, ...newComments };
    },
    yesMoreComments: (state) => (state.moreComments = true),
    noMoreComments: (state) => (state.moreComments = false),
    clearDataState: (state) => (state.subs = []),
  },
});

export default DataMod;
const dataActionContext = (
  context: any // eslint-disable-line
) => moduleActionContext(context, DataMod);
