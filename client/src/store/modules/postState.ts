import { MutationTree, ActionTree } from "vuex";

interface Comment {
  _id: string;
  body: string;
  points: number;
  user: string;
  post: string;
  createdatAt: number;
}

interface Post {
  _id: string;
  title: string;
  body: string;
  user: string;
  sub: string;
  createdAt: number;
}

interface CurrentPostState {
  post: Post | null;
  comments: Array<Comment> | null;
  isLoading: boolean;
  error: string | null;
}

const module = {
  namespaced: true,
  state: {
    post: null,
    comments: null,
    isLoading: false,
    error: null,
  },
  actions: {
    getPost: async ({ commit }, post: string) => {
      commit("startLoading");
      try {
        const req = await fetch(`/api/v1/comments/${post}`, {
          method: "GET",
        });

        const json = await req.json();

        if (json.success) {
          commit("setPost", json.data.post);
          commit("setComments", json.data.comments);
        }
      } catch (error) {
        console.log(error);
      }
      commit("endLoading");
    },
  } as ActionTree<CurrentPostState, null>,
  mutations: {
    startLoading: (state) => (state.isLoading = true),
    endLoading: (state) => (state.isLoading = false),
    setComments: (state, comments) => (state.comments = comments),
    setPost: (state, post) => (state.post = post),
  } as MutationTree<CurrentPostState>,
};

export default module;
