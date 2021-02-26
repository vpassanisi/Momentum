/* eslint-disable @typescript-eslint/no-use-before-define */

import { defineModule } from "direct-vuex";
import { moduleActionContext } from "../index";
import  type {Comment, Post} from "./types"

const state = () => ({
  points: {} as Record<string, boolean>,
  targetIDs: [] as Array<string>,
  isPointLoading: false,
  pointError: "",
});

export type PointState = ReturnType<typeof state>;

const PointMod = defineModule({
  state,
  actions: {
    getPoints: async (context, targetIDs) => {
      const { commit } = pointActionContext(context);
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query Input($targetIDs: [String]!) {
              points(targetIDs: $targetIDs)
            }
            `,
            variables: {
              targetIDs: targetIDs,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const points: Record<string, boolean> = JSON.parse(data.points);

        commit.updatePoints(points);
      } catch (error) {
        commit.setPointError(error.message);
        console.log(error.message);
      }
      commit.endLoading();
    },
    incrementComment: async (context, id: string) => {
      const { commit, rootCommit } = pointActionContext(context);
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation Input($commentID: String) {
              increment(commentID: $commentID) {
                comment {
                  _id
                  parent
                  points
                }
              }
            }`,
            variables: {
              commentID: id,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const comment: Comment = data.increment.comment

        commit.updatePoints({[comment._id]: true})
        rootCommit.updateCommentPoints(comment)
       
      } catch (error) {
        console.log(error);
        commit.setPointError(error.message);
      }
    },
    decrementComment: async (context, id: string) => {
      const { commit, rootCommit } = pointActionContext(context);
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation Input($commentID: String) {
              decrement(commentID: $commentID) {
                comment {
                  _id
                  parent
                  points
                }
              }
            }`,
            variables: {
              commentID: id,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const comment: Comment = data.decrement.comment
          
        commit.updatePoints({[comment._id]: false})
        rootCommit.updateCommentPoints(comment)
      } catch (error) {
        console.log(error.message);
        commit.setPointError(error.message)
      }
    },
    incrementPost: async (context, id: string) => {
      const { commit, rootCommit } = pointActionContext(context);
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation Input($postID: String) {
              increment(postID: $postID) {
                post {
                  _id
                  points
                }
              }
            }`,
            variables: {
              postID: id,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const post: Post = data.increment.post

        commit.updatePoints({[post._id]: true})
        rootCommit.Post_updatePostPoints(post.points)
        rootCommit.SubMod.Sub_updatePostPoints(post)
      } catch (error) {
        console.log(error);
        commit.setPointError(error.message)
      }
    },
    decrementPost: async (context, postID: string) => {
      const { commit, rootCommit } = pointActionContext(context);
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation Input($postID: String) {
              decrement(postID: $postID) {
                post {
                  _id
                  points
                }
              }
            }`,
            variables: {
              postID: postID,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const post: Post = data.decrement.post

        commit.updatePoints({[post._id]: false})
        rootCommit.Post_updatePostPoints(post.points)
        rootCommit.SubMod.Sub_updatePostPoints(post)
      } catch (error) {
        console.log(error);
        commit.setPointError(error.message)
      }
    },
    removeCommentPoint: async (context, commentID: string) => {
      const {commit, rootCommit} = pointActionContext(context)
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation Input($commentID: String) {
              remove(commentID: $commentID) {
                comment {
                  _id
                  parent
                  points
                }
              }
            }`,
            variables: {
              commentID: commentID,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const comment: Comment = data.remove.comment

        commit.deletePoint(comment._id)
        rootCommit.updateCommentPoints(comment)
      } catch (error) {
        console.log(error.message)
        commit.setPointError(error.message)
      }
    },
    removePostPoint: async (context, postID: string) => {
      const { commit, rootCommit } = pointActionContext(context);
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation Input($postID: String) {
              remove(postID: $postID) {
                post {
                  _id
                  points
                }
              }
            }`,
            variables: {
              postID: postID,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const post: Post = data.remove.post

        commit.deletePoint(post._id)
        rootCommit.SubMod.Sub_updatePostPoints(post)
        rootCommit.Post_updatePostPoints(post.points)
      } catch (error) {
        console.log(error);
        commit.setPointError(error.message)
      }
    },
  },
  mutations: {
    startLoading: (state) => (state.isPointLoading = true),
    endLoading: (state) => (state.isPointLoading = false),
    clearPointState: (state) => {
      state.points = {};
    },
    setPoints: (state, points: Record<string, boolean>) => {
      state.points = points;
    },
    setPointError: (state, error: string) => {
      state.pointError = error;
      setTimeout(() => (state.pointError = ""), 3000);
    },
    updatePoints: (state, newPoints: Record<string, boolean>) => {
      state.points = { ...state.points, ...newPoints };
    },
    deletePoint: (state, targetId: string) => {
      delete state.points[targetId];
    },
    setTargetIDs: (state, arr: string[]) => {
      state.targetIDs = arr;
    },
    updateTargetIDs: (state, arr: string[]) => {
      state.targetIDs = [...state.targetIDs, ...arr];
    },
  },
});

export default PointMod;
const pointActionContext = (
  context: any // eslint-disable-line
) => moduleActionContext(context, PointMod);
