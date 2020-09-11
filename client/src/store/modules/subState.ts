import { MutationTree, ActionTree } from "vuex";
import router from "@/router/index";

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

interface CreateSub {
  name: string;
  description: string;
  banner: string;
  icon: string;
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
  subsArr: Array<Sub>;
  posts: Array<Post> | null;
  isSubLoading: boolean;
  subError: string | null;
}

interface GetPostsObj {
  sub: string;
  sort: string;
  order: number;
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
    subsArr: [],
    posts: null,
    isSubLoading: false,
    subError: null,
  },
  actions: {
    getPostsBySubName: async ({ commit }, obj: GetPostsObj) => {
      commit("startLoading");
      try {
        const req = await fetch(
          `/api/v1/posts/?sub=${obj.sub}&sort=${obj.sort}&order=${obj.order}`,
          { method: "GET" }
        );

        const json = await req.json();

        if (json.success) {
          commit("getPostsBySubNameSuccess", {
            posts: json.data.posts,
            sub: json.data.sub,
          });
          commit("PointState/setTargetIds", json.data.targetIds, {
            root: true,
          });
          setColors(
            json.data.sub.colorPrimary,
            json.data.sub.colorPrimaryLight,
            json.data.sub.colorPrimaryDark
          );
        } else {
          commit("subErrors", json.data.message);
        }
      } catch (error) {
        commit("subError", "Promise rejected with an error");
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
          commit("subError", json.message);
        }
      } catch (error) {
        commit("subError", "Promise rejected with an error");
        console.log(error);
      }
      commit("endLoading");
    },
    createSub: async ({ commit }, sub: CreateSub) => {
      commit("startLoading");
      try {
        const req = await fetch(`/api/v1/subs/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sub),
        });

        const json = await req.json();

        if (json.success) {
          commit("createSubSuccess", json.data);
          setColors(
            json.data.colorPrimary,
            json.data.colorPrimaryLight,
            json.data.colorPrimaryDark
          );
          router.push(`/s/${json.data.name}`);
        } else {
          commit("subError", json.message);
        }
      } catch (error) {
        commit("subError", "Promise rejected with an error");
        console.log(error);
      }
      commit("endLoading");
    },
    getSubs: async ({ commit }) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/subs/?key=name&order=asc`, {
          method: "GET",
        });

        const json = await res.json();

        if (json.success) {
          commit("setSubsArr", json.data);
        } else {
          commit("subError", json.message);
        }
      } catch (error) {
        console.log(error);
        commit("subError", "Promise rejected with an error");
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
    setSubsArr: (state, subs) => {
      state.subsArr = subs;
    },
    getSubByNameSuccess: (state, sub) => (state.sub = sub),
    createSubSuccess: (state, sub) => (state.sub = sub),
    updatePostPoints: (state, post) => {
      if (state.posts) {
        const index = state.posts.findIndex((v) => {
          return v._id === post._id;
        });

        state.posts[index].points = post.points;
      }
    },
    subError: (state, error) => {
      state.subError = error;
      setTimeout(() => (state.subError = null), 3000);
    },
  } as MutationTree<CurrentSubState>,
};

export default module;
