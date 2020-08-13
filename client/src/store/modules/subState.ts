import { MutationTree, ActionTree } from "vuex";

interface Sub {
  _id: string;
  name: string;
  description: string;
  founder: string;
  banner: string;
  createdatAt: number;
  colorPrimary: string;
  colorPrimaryLight: string;
  colorPrimaryDark: string;
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

const setColors = (
  colorPrimary: string,
  colorPrimaryLight: string,
  colorPrimaryDark: string
) => {
  const colorsEl = document.getElementById("colors");
  if (colorsEl && colorPrimary !== "") {
    colorsEl.style.setProperty("--primary", colorPrimary);
  }
  if (colorsEl && colorPrimaryLight !== "") {
    colorsEl.style.setProperty("--primary-light", colorPrimaryLight);
  }
  if (colorsEl && colorPrimaryDark !== "") {
    colorsEl.style.setProperty("--primary-dark", colorPrimaryDark);
  }
};

const module = {
  namespaced: true,
  state: {
    sub: null,
    posts: null,
    isLoading: false,
    error: null,
  },
  actions: {
    getPostsBySubName: async ({ commit }, sub: string) => {
      commit("startLoading");
      try {
        const req = await fetch(`/api/v1/posts/${sub}`, {
          method: "GET",
        });

        const json = await req.json();

        if (json.success) {
          commit("setPosts", json.data.posts);
          commit("setSub", json.data.sub);
          setColors(
            json.data.sub.colorPrimary,
            json.data.sub.colorPrimaryLight,
            json.data.sub.colorPrimaryDark
          );
        }
      } catch (error) {
        console.log(error);
      }
      commit("endLoading");
    },
    getSubByName: async ({ commit }, sub: string) => {
      commit("startLoading");
      try {
        const req = await fetch(`/api/v1/subs/?name=${sub}`, {
          method: "GET",
        });

        const json = await req.json();

        if (json.success) {
          commit("setSub", json.data[0]);
          setColors(
            json.data[0].colorPrimary,
            json.data[0].colorPrimaryLight,
            json.data[0].colorPrimaryDark
          );
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
