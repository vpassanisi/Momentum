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

interface Post {
  _id: string;
  title: string;
  body: string;
  points: number;
  user: string;
  sub: string;
  createdAt: number;
}

interface PostState {
  post: Post | null;
  points: Record<string, any>;
  targetIds: Array<string>;
  isPostLoading: boolean;
  postError: string | null;
}

const module = {
  namespaced: true,
  state: {
    post: null,
    isPostLoading: false,
    postError: null,
  },
  actions: {
    getPostAndComments: async ({ commit }, postID: string) => {
      commit("startLoading");
      try {
        const res = await fetch(
          `/api/v1/comments/?postID=${postID}&sort=points&order=-1&post=true`,
          {
            method: "GET",
          }
        );

        const json = await res.json();

        if (json.success) {
          const a = {
            post: json.data.post,
            comments: json.data.comments,
            sort: "points",
            order: -1,
          };

          commit("getPostByIdSuccess", a);

          if (a.comments[postID].length < 10) {
            commit("CommentState/noMoreComments", null, { root: true });
          }

          if (a.comments[postID].length > 0) {
            commit("CommentState/setComments", a, { root: true });
          }

          commit("PointState/setTargetIds", json.data.targetIds, {
            root: true,
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
    clearPostState: ({ commit }) => {
      commit("clearPostsState");
    },
  } as ActionTree<PostState, null>,
  mutations: {
    startLoading: (state) => (state.isPostLoading = true),
    endLoading: (state) => (state.isPostLoading = false),
    getPostByIdSuccess: (state, { post }) => {
      state.post = post;
    },
    getPostByIdFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    createPostFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    updatePostPoints: (state, post: Post) => {
      if (state.post) {
        state.post.points = post.points;
      }
    },
    clearPostsState: (state) => {
      state.post = null;
    },
  } as MutationTree<PostState>,
};

export default module;
