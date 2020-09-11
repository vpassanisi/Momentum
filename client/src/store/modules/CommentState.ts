import { MutationTree, ActionTree } from "vuex";

interface Post {
  _id: string;
  title: string;
  body: string;
  points: number;
  user: string;
  sub: string;
  createdAt: number;
}

interface CreateCommentObj {
  postId: string;
  body: string;
  parentId: string;
  rootId: string;
}

interface Comment {
  _id: string;
  body: string;
  points: number;
  user: string;
  post: string;
  parent: string;
  createdAt: number;
}

interface CommentState {
  comments: Record<string, Array<Comment>>;
  isCommentLoading: boolean;
  commentError: null | string;
  moreComments: boolean;
  pagination: Pagination;
}

interface Pagination {
  postID: string;
  sort: string;
  order: number;
  lastVal: string | number;
  lastCreatedAt: number;
}

interface SetCommentsObj {
  post: Post;
  comments: Record<string, Array<Comment>>;
  order: number;
  sort: string;
}

const module = {
  namespaced: true,
  state: {
    comments: {},
    pagination: {
      sort: "points",
      order: -1,
      postID: "",
      lastVal: 0,
      lastCreatedAt: "",
    },
    moreComments: true,
    isCommentsLoading: false,
    commentError: null,
  },
  actions: {
    newCommentByPost: async ({ commit }, obj: CreateCommentObj) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/comments/${obj.postId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: obj.body,
            parent: obj.parentId,
            root: obj.rootId,
          }),
        });

        const json = await res.json();

        if (json.success) {
          commit("newCommentSuccess", json.data);
        } else {
          commit("newCommentFail", json.message);
          console.log(json);
        }
      } catch (error) {
        commit("newCommentFail", "Promise rejected with an error");
        console.error(error);
      }
      commit("endLoading");
    },
    updateComments: async ({ commit, state }) => {
      commit("startLoading");
      commit("setMoreComments");
      try {
        const res = await fetch(
          `/api/v1/comments/?postID=${state.pagination.postID}&sort=${state.pagination.sort}&order=${state.pagination.order}&post=true`,
          {
            method: "GET",
          }
        );

        const json = await res.json();

        if (json.success) {
          const a = {
            post: json.data.post,
            comments: json.data.comments,
          };

          commit("updateCommentsSuccess", a);
          commit("PointState/setTargetIds", json.data.targetIds, {
            root: true,
          });
        } else {
          commit("commentError", json.message);
        }
      } catch (error) {
        console.log(error);
        commit("commentError", "Promise rejected with an error");
      }
      commit("endLoading");
    },
    getNextComments: async ({ commit, state }) => {
      commit("startLoading");
      try {
        const res = await fetch(
          `/api/v1/comments/?postID=${state.pagination.postID}&order=${state.pagination.order}&sort=${state.pagination.sort}&lastVal=${state.pagination.lastVal}&lastCreatedAt=${state.pagination.lastCreatedAt}`,
          { method: "GET" }
        );

        const json = await res.json();

        if (json.success) {
          if (json.data.comments[state.pagination.postID].length < 10) {
            commit("noMoreComments");
          }

          commit("getNextCommentsSuccess", json.data.comments);
          commit("PointState/addToTargetIds", json.data.targetIds, {
            root: true,
          });
        } else {
          commit("commentError", json.message);
        }
      } catch (error) {
        console.log(error);
        commit("commentError", "Promise rejected with an error");
      }
      commit("endLoading");
    },
    setPagination: ({ commit }, obj) => {
      commit("setPagination", obj);
    },
    clearCommentState: ({ commit }) => {
      commit("clearCommentState");
    },
  } as ActionTree<CommentState, null>,
  mutations: {
    setComments: (state, obj: SetCommentsObj) => {
      if (state.comments[obj.post._id] === undefined) {
        state.comments[obj.post._id] = [];
      }
      state.comments[obj.post._id] = [
        ...state.comments[obj.post._id],
        ...obj.comments[obj.post._id],
      ];
      delete obj.comments[obj.post._id];

      state.comments = { ...state.comments, ...obj.comments };

      const lastIndex = state.comments[obj.post._id].length - 1;

      if (obj.sort === "points") {
        state.pagination.lastVal =
          state.comments[obj.post._id][lastIndex].points;
      } else {
        state.pagination.lastVal =
          state.comments[obj.post._id][lastIndex].createdAt;
      }

      state.pagination.postID = obj.post._id;

      state.pagination.lastCreatedAt =
        state.comments[obj.post._id][lastIndex].createdAt;
    },
    setPagination: (state, obj) => {
      state.pagination = { ...state.pagination, ...obj };
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
    newCommentFail: (state, error) => {
      state.commentError = error;
      setTimeout(() => (state.commentError = null), 3000);
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
    commentError: (state, error) => {
      state.commentError = error;
      setTimeout(() => (state.commentError = null), 3000);
    },
    startLoading: (state) => (state.isCommentLoading = true),
    endLoading: (state) => (state.isCommentLoading = false),
    clearCommentState: (state) => {
      state.comments = {};
      state.moreComments = true;
      state.pagination.order = -1;
      state.pagination.sort = "points";
    },
  } as MutationTree<CommentState>,
};

export default module;
