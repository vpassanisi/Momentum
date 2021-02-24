import { MutationTree, ActionTree, Module } from "vuex";
import router from "@/router/index";
import { RootState } from "..";

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

const state = () => ({
  post: null as Post | null,
  isPostLoading: false,
  postError: "",
});

export type PostState = ReturnType<typeof state>;

const actions: ActionTree<PostState, RootState> = {
  getPostAndComments: async ({ commit }, postID: string) => {
    commit("startLoading");
    try {
      const res = await fetch(`/gql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query Input($postID: String!, ) {
            post(postID: $postID,){
                _id
               title
               body
               points
               user {
                   name
               }
               sub
               createdAt
               commentsMap
               targetIDs
            }
        }`,
          variables: {
            postID: postID,
          },
        }),
      });

      const { errors, data } = await res.json();

      if (errors) throw Error(errors[0].message);

      const a = {
        post: data.post,
        comments: data.post.commentsMap,
        sort: "points",
        order: -1,
      };

      commit("getPostByIdSuccess", a);
      commit("CommentState/setComments", a, { root: true });

      if (a.comments[postID].length < 10) {
        commit("CommentState/noMoreComments", null, { root: true });
      }

      commit("PointState/setTargetIDs", data.post.targetIDs, {
        root: true,
      });
    } catch (error) {
      commit("getPostByIdFail", error.message);
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
          `/s/${router.currentRoute.value.params.sub}/comments/${json.data._id}`
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
};

const mutations: MutationTree<PostState> = {
  startLoading: (state) => (state.isPostLoading = true),
  endLoading: (state) => (state.isPostLoading = false),
  getPostByIdSuccess: (state, { post }) => {
    state.post = post;
  },
  getPostByIdFail: (state, error) => {
    state.postError = error;
    setTimeout(() => (state.postError = ""), 3000);
  },
  createPostFail: (state, error) => {
    state.postError = error;
    setTimeout(() => (state.postError = ""), 3000);
  },
  updatePostPoints: (state, points: number) => {
    if (state.post) {
      state.post.points = points;
    }
  },
  clearPostsState: (state) => {
    state.post = null;
  },
};

const module: Module<PostState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default module;
