import { MutationTree, ActionTree } from "vuex";

interface Sub {
  _id: string;
  name: string;
  description: string;
  founder: string;
  banner: string;
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

interface CurrentSubState {
  sub: Sub | null;
  posts: Array<Post> | null;
  isLoading: boolean;
  error: string | null;
}

const module = {
  namespaced: true,
  state: {
    sub: null,
    posts: null,
    isLoading: false,
    error: null,
  },
  actions: {
    getPosts: async ({ commit }, sub: string) => {
      commit("startLoading");
      try {
        const req = await fetch(`/api/v1/posts/${sub}`, {
          method: "GET",
        });

        const json = await req.json();

        if (json.success) {
          commit("setPosts", json.data.posts);
          commit("setSub", json.data.sub);
        }
      } catch (error) {
        console.log(error);
      }
      commit("endLoading");
    },
  } as ActionTree<CurrentSubState, null>,
  mutations: {
    startLoading: (state) => (state.isLoading = true),
    endLoading: (state) => (state.isLoading = false),
    setPosts: (state, posts) => (state.posts = posts),
    setSub: (state, sub) => (state.sub = sub),
  } as MutationTree<CurrentSubState>,
};

export default module;
