import { MutationTree, ActionTree } from "vuex";

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
  createdatAt: number;
}

interface CommentState {
  comments: Record<string, Array<Comment>>;
  isCommentLoading: boolean;
  commentError: null | string;
}

const module = {
  namespaced: true,
  state: {
    comments: {},
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
    clearCommentState: ({ commit }) => {
      commit("clearCommentState");
    },
  } as ActionTree<CommentState, null>,
  mutations: {
    setComments: (state, { post, comments }) => {
      if (state.comments[post._id] === undefined) {
        state.comments[post._id] = [];
      }
      state.comments[post._id] = [
        ...state.comments[post._id],
        ...comments[post._id],
      ];
      delete comments[post._id];

      state.comments = { ...state.comments, ...comments };
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
    startLoading: (state) => (state.isCommentLoading = true),
    endLoading: (state) => (state.isCommentLoading = false),
    clearCommentState: (state) => (state.comments = {}),
  } as MutationTree<CommentState>,
};

export default module;
