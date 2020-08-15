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

interface User {
  _id: string;
  name: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  body: string;
  user: string;
  points: number;
  sub: User;
  createdAt: number;
}

interface CurrentSubState {
  sub: Sub | null;
  posts: Array<Post> | null;
  isSubLoading: boolean;
  subError: string | null;
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
    isSubLoading: false,
    subError: null,
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
          commit("getPostsBySubNameSuccess", {
            posts: json.data.posts,
            sub: json.data.sub,
          });
          setColors(
            json.data.sub.colorPrimary,
            json.data.sub.colorPrimaryLight,
            json.data.sub.colorPrimaryDark
          );
        } else {
          commit("getPostsBySubNameFail", json.data.message);
        }
      } catch (error) {
        commit("getPostsBySubNameFail", "Promise rejected with an error");
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
          commit("getSubByNameSuccess", json.data[0]);
          setColors(
            json.data[0].colorPrimary,
            json.data[0].colorPrimaryLight,
            json.data[0].colorPrimaryDark
          );
        } else {
          commit("getSubByNameFail", json.message);
        }
      } catch (error) {
        commit("getSubByNameFail", "Promise rejected with an error");
        console.log(error);
      }
      commit("endLoading");
    },
  } as ActionTree<CurrentSubState, null>,
  mutations: {
    startLoading: (state) => (state.isSubLoading = true),
    endLoading: (state) => (state.isSubLoading = false),
    getPostsBySubNameSuccess: (state, { posts, sub }) => {
      state.posts = posts;
      state.sub = sub;
    },
    getPostsBySubNameFail: (state, error) => {
      state.subError = error;
      setTimeout(() => (state.subError = null), 3000);
    },
    getSubByNameSuccess: (state, sub) => (state.sub = sub),
    getSubByNameFail: (state, error) => {
      state.subError = error;
      setTimeout(() => (state.subError = null), 3000);
    },
  } as MutationTree<CurrentSubState>,
};

export default module;
