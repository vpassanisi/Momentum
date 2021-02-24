import { MutationTree, ActionTree, Module, GetterTree } from "vuex";
import router from "@/router/index";
import type {RootState} from "../index"

export interface Sub {
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
  name: string;
}

export interface PostType {
  _id: string;
  title: string;
  body: string;
  user: User;
  points: number;
  sub: string;
  createdAt: number;
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

const state = () => ({
  sub: null as null | Sub,
  subsArr: [] as Array<Sub>,
  posts: [] as Array<PostType>,
  isSubLoading: false,
  subError: "",
});

export type SubState = ReturnType<typeof state>;

const getters: GetterTree<SubState, RootState> = {
  targetIDs(state) {
    return state.posts.map((post) => post._id)
  }
}

const actions: ActionTree<SubState, RootState>  = {
  subAndPosts: async ({ commit }, obj: GetPostsObj) => {
    commit("startLoading");
    try {
      const res = await fetch(`/gql`,{ 
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          query: `
          query Input($name: String, $order: Int, $by: String) {
            subs(name: $name, order: $order, by: $by){
                _id
                name
                description
                founder
                banner
                createdAt
                icon
                colorPrimary
                colorPrimaryLight
                colorPrimaryDark
                posts {
                    _id
                    title
                    body
                    points
                    user {
                      name
                    }
                    sub
                    createdAt
                }
            }
        }`,
        variables: {
          name: obj.sub,
          order: obj.order,
          by: obj.sort
        }
        })
       });

       const {errors, data} = await res.json();

      if(errors) throw Error(errors[0].message)
      
      const posts = data.subs[0].posts
      const sub = data.subs[0]
      sub.posts = undefined

        commit("subAndPostsSuccess", {
          posts,
          sub
        });
        // commit("PointState/setTargetIds", json.data.targetIds, {
        //   root: true,
        // });
        setColors(
          sub.colorPrimary,
          sub.colorPrimaryLight,
          sub.colorPrimaryDark
        );
      
    } catch (error) {
      console.log(error);
      commit("subError", error.message)
    }
    commit("endLoading");
  },
  getSubByName: async ({ commit }, sub: string) => {
    commit("startLoading");
    try {
      const res = await fetch(`/gql`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          query:`
          query Input($name: String) {
            subs(name: $name){
                _id
                name
                description
                founder
                banner
                createdAt
                icon
                colorPrimary
                colorPrimaryLight
                colorPrimaryDark
            }
        }`,
        variables: {
          name: sub
        }
        })
      });

      const {errors, data} = await res.json();

      if(errors) throw Error(errors[0].message)

      commit("getSubByNameSuccess", data.subs[0]);
      setColors(
        data.subs[0].colorPrimary,
        data.subs[0].colorPrimaryLight,
        data.subs[0].colorPrimaryDark
      );
    } catch (error) {
      console.log(error);
      commit("subError", error.message);
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
      const res = await fetch(`http://localhost/gql`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          query: `
          query {
            subs {
              _id
              name
              description
              founder
              banner
              createdAt
              icon
              colorPrimary
              colorPrimaryLight
              colorPrimaryDark
            }
          }
          `
        })
      });

      const {errors, data} = await res.json();

      if(errors) throw Error(errors[0].message)
      
      commit("setSubsArr", data.subs)
    } catch (error) {
      console.log(error);
      commit("subError", error.message);
    }
    commit("endLoading");
  },
};

const mutations: MutationTree<SubState> = {
  startLoading: (state) => (state.isSubLoading = true),
  endLoading: (state) => (state.isSubLoading = false),
  subAndPostsSuccess: (state, { posts, sub }) => {
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
    setTimeout(() => (state.subError = ""), 3000);
  },
}

const module: Module<SubState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default module
