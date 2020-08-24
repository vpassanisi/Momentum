import { MutationTree, ActionTree } from "vuex";
import router from "@/router/index";

interface NewPost {
  title: string;
  body: string;
}

interface CreatePostObj {
  subId: string;
  post: NewPost;
}

interface CreateCommentObj {
  postId: string;
  body: string;
  parentId: string;
  rootId: string;
}

interface GetPointsObj {
  targetIds: Array<string>;
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

interface Post {
  _id: string;
  title: string;
  body: string;
  points: number;
  user: string;
  sub: string;
  createdAt: number;
}

interface Comments {
  [key: string]: Array<Comment>;
}

interface CurrentPostState {
  post: Post | null;
  comments: Comments;
  points: Record<string, any>;
  targetIds: Array<string>;
  isPostLoading: boolean;
  postError: string | null;
}

const module = {
  namespaced: true,
  state: {
    post: null,
    comments: {},
    points: {},
    tragetIds: [],
    isPostLoading: false,
    postError: null,
  },
  actions: {
    getPostAndComments: async ({ commit }, post: string) => {
      commit("startLoading");
      try {
        const res = await fetch(
          `/api/v1/comments/?postID=${post}&sort=createdat&order=-1`,
          {
            method: "GET",
          }
        );

        const json = await res.json();

        if (json.success) {
          commit("getPostByIdSuccess", {
            post: json.data.post,
            comments: json.data.comments,
          });
        } else {
          commit("getPostByIdFail", json.message);
        }
      } catch (error) {
        commit("getPostByIdFail", "Promise rejected with error");
        console.error(error);
      }
      commit("endLoading");
    },
    getPoints: async ({ commit }, arr: GetPointsObj) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/points`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: arr }),
        });

        const json = await res.json();

        if (json.success) {
          commit("getPointsSuccess", json.data);
        } else {
          commit("getPointsFail", json.message);
        }
      } catch (error) {
        console.log(error);
        commit("getPointsfail", "Promise rejected with an error");
      }
      commit("endLoading");
    },
    createPost: async ({ commit }, obj: CreatePostObj) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/posts/${obj.subId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj.post),
        });

        const json = await res.json();

        if (json.success) {
          router.push(
            `/s/${router.currentRoute.params.sub}/comments/${json.data._id}`
          );
        } else {
          commit("createPostFail", json.message);
        }
      } catch (error) {
        commit("createPostFail", "Promise rejected with an error");
        console.error(error);
      }
      commit("endLoading");
    },
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
    clearState: ({ commit }) => {
      commit("clearState");
    },
    incrementComment: async ({ commit }, id: string) => {
      try {
        const res = await fetch(
          `/api/v1/points/increment/?type=comment&id=${id}`,
          {
            method: "POST",
          }
        );

        const json = await res.json();

        if (json.success) {
          commit("incrementCommentSuccess", json.data.point);
        } else {
          commit("incrementCommentFail", json.message);
        }
      } catch (error) {
        console.log(error);
        commit("incrementCommentFail", "Promise rejected with an error");
      }
    },
    decrementComment: async ({ commit }, id: string) => {
      try {
        const res = await fetch(
          `/api/v1/points/decrement/?type=comment&id=${id}`,
          {
            method: "POST",
          }
        );

        const json = await res.json();

        if (json.success) {
          commit("decrementCommentSuccess", json.data.point);
        } else {
          commit("decrementCommentFail", json.message);
        }
      } catch (error) {
        console.log(error);
        commit("decrementCommentFail", "Promise rejected with an error");
      }
    },
  } as ActionTree<CurrentPostState, null>,
  mutations: {
    startLoading: (state) => (state.isPostLoading = true),
    endLoading: (state) => (state.isPostLoading = false),
    getPostByIdSuccess: (state, { post, comments }) => {
      state.post = post;
      if (state.comments[post._id] === undefined) {
        state.comments[post._id] = [];
      }
      state.comments[post._id] = [
        ...state.comments[post._id],
        ...comments[post._id],
      ];
      delete comments[post._id];

      state.comments = { ...state.comments, ...comments };

      const arr = [];
      for (const k in state.comments) arr.push(k);
      state.targetIds = arr;
    },
    getPostByIdFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    newCommentSuccess: (state, comment: Comment) => {
      state.comments[comment._id] = [];

      state.comments[comment.parent] = [
        comment,
        ...state.comments[comment.parent],
      ];
    },
    newReplySuccess: (state, comment: Comment) => {
      state.comments[comment._id] = [];

      state.comments[comment.parent] = [
        comment,
        ...state.comments[comment.parent],
      ];
    },
    newCommentFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    newReplyFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    createPostFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    getPointsSuccess: (state, points) => {
      state.points = points;
    },
    getPointsFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    incrementCommentSuccess: (state, obj) => {
      state.points = { ...state.points, ...obj };
    },
    incrementCommentFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    decrementCommentSuccess: (state, obj) => {
      state.points = { ...state.points, ...obj };
    },
    decrementCommentFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    clearState: (state) => {
      state.post = null;
      state.comments = {};
    },
  } as MutationTree<CurrentPostState>,
};

export default module;
