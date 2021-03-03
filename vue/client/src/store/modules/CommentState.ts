/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/member-delimiter-style */

import { defineModule } from "direct-vuex";
import { moduleActionContext } from "../index";
import type {Post, Comment} from "./types"

const state = () => ({
  comments: {} as Record<string, Array<Comment>>,
  pagination: {
    sort: "points",
    order: -1,
    postID: "",
    lastVal: 0,
    lastCreatedAt: 0,
  },
  moreComments: true,
  isCommentsLoading: false,
  commentError: "",
});

export type CommentState = ReturnType<typeof state>;

const CommentMod = defineModule({
  state,
  actions: {
    newComment: async (context, obj: {postID: string, parentID: string, rootID: string, body: string}) => {
      const {commit} = commentActionContext(context) 
      commit.startLoading()
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
            }
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const comment: Comment = data.newComment
        
        commit.newCommentSuccess(comment)
      
      } catch (error) {
        console.error(error.message);
        commit.setcommentError(error.message)
      }
      commit.endLoading()
    },
    updateComments: async (context) => {
      const {commit, state} = commentActionContext(context) 
      commit.startLoading()
      commit.setMoreComments()
      try {
        const res = await fetch(
          `/api/v1/comments/?postID=${state.pagination.postID}&sort=${state.pagination.sort}&order=${state.pagination.order}&post=true`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
              
              `,
            })
          }
        );

        const json = await res.json();

        if (json.success) {
          // const a = {
          //   post: json.data.post,
          //   comments: json.data.comments,
          // };

          // commit("updateCommentsSuccess", a);
          // commit("PointState/setTargetIds", json.data.targetIds, {
            // root: true,
          // });
        }
      } catch (error) {
        console.log(error.message);
        commit.setcommentError(error.message)
      }
      commit.endLoading()
    },
    getNextComments: async (context) => {
      const {commit, state} = commentActionContext(context) 
      commit.startLoading();
      try {
        const res = await fetch(
          `/api/v1/comments/?postID=${state.pagination.postID}&order=${state.pagination.order}&sort=${state.pagination.sort}&lastVal=${state.pagination.lastVal}&lastCreatedAt=${state.pagination.lastCreatedAt}`,
          { method: "GET" }
        );

        const json = await res.json();

        if (json.success) {
          if (json.data.comments[state.pagination.postID].length < 10) {
            commit.noMoreComments()
          }

          // commit("getNextCommentsSuccess", json.data.comments);
          // commit("PointState/addToTargetIds", json.data.targetIds, {
          //   root: true,
          // });
        }
      } catch (error) {
        console.log(error.message);
        commit.setcommentError(error.message)
      }
      commit.endLoading()
    },
  },
  mutations: {
    setComments: (state, {post, comments, sort}: {post: Post, comments: Record<string, Comment[]>, sort: string}) => { 
      if (state.comments[post._id] === undefined) {
        state.comments[post._id] = [];
      }

      state.comments = { ...comments, ...state.comments };

      state.comments[post._id] = state.comments[post._id].concat(
        comments[post._id]
      );

      // set pagination
      const lastIndex = state.comments[post._id].length - 1;
      state.pagination.postID = post._id;

      if (comments[post._id].length === 0) return;

      if (sort === "points") {
        state.pagination.lastVal =
          state.comments[post._id][lastIndex].points;
      } else {
        state.pagination.lastVal =
          state.comments[post._id][lastIndex].createdAt;
      }

      state.pagination.lastCreatedAt =
        state.comments[post._id][lastIndex].createdAt;
    },
    setPagination: (state, o: {sort?: string, order?: number}) => {
      state.pagination = { ...state.pagination, ...o };
    },
    updateCommentsSuccess: (state, { comments }) => {
      // update pagination
      const postID = state.pagination.postID;
      const lastIndex = comments[postID].length - 1;
      state.pagination.lastCreatedAt = comments[postID][lastIndex].createdAt;
      if (state.pagination.sort === "points") {
        state.pagination.lastVal = comments[postID][lastIndex].points;
      } else {
        state.pagination.lastVal = comments[postID][lastIndex].createdAt;
      }

      // set comments
      state.comments = { ...comments };
    },
    updateCommentPoints: (state, comment: Comment) => {
      const index = state.comments[comment.parent].findIndex((v) => {
        return v._id === comment._id;
      });

      state.comments[comment.parent][index].points = comment.points;
    },
    newCommentSuccess: (state, comment: Comment) => {
      state.comments[comment._id] = [];

      state.comments[comment.parent] = [
        comment,
        ...state.comments[comment.parent],
      ];
    },
    getNextCommentsSuccess: (
      state,
      newComments: Record<string, Array<Comment>>
    ) => {
      const postID = state.pagination.postID;

      // update pagination
      const lastIndex = newComments[state.pagination.postID].length - 1;
      state.pagination.lastCreatedAt = newComments[postID][lastIndex].createdAt;
      if (state.pagination.sort === "points") {
        state.pagination.lastVal = newComments[postID][lastIndex].points;
      } else {
        state.pagination.lastVal = newComments[postID][lastIndex].createdAt;
      }

      // update comments
      state.comments[postID] = state.comments[postID].concat(
        newComments[postID]
      );

      delete newComments[postID];

      state.comments = { ...state.comments, ...newComments };

      // update pagination
    },
    noMoreComments: (state) => (state.moreComments = false),
    setMoreComments: (state) => (state.moreComments = true),
    setcommentError: (state, error: string) => {
      state.commentError = error;
      setTimeout(() => (state.commentError = ""), 3000);
    },
    startLoading: (state) => (state.isCommentsLoading = true),
    endLoading: (state) => (state.isCommentsLoading = false),
    clearCommentState: (state) => {
      state.comments = {};
      state.moreComments = true;
      state.pagination.order = -1;
      state.pagination.sort = "points";
    },
  },
});

export default CommentMod;
const commentActionContext = (context: any) => // eslint-disable-line
  moduleActionContext(context, CommentMod);
