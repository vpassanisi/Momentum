/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-use-before-define */

import router from "@/router/index";
import { defineModule } from "direct-vuex";
import { moduleActionContext } from "../index";
import type {Post, Sub} from "./types"



interface CreateSub {
  name: string;
  description: string;
  banner: string;
  icon: string;
  colorPrimary: string;
  colorPrimaryLight: string;
  colorPrimaryDark: string;
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
  subsArr: [] as Sub[],
  posts: [] as Post[],
  isSubLoading: false,
  subError: "",
});

export type SubState = ReturnType<typeof state>;

const SubMod = defineModule({
  namespaced: true as true,
  state,
  getters: {
    targetIDs: function(state): string[] {
      return state.posts.map((post) => post._id);
    },
  },
  actions: {
    subAndPosts: async (context, obj: {sub: string, sort: string, order: number}) => {
      const { commit } = subActionContext(context);
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
              by: obj.sort,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const posts: Post[] = data.subs[0].posts;
        delete data.subs[0].posts
        const sub: Sub = data.subs[0];

        commit.setSub(sub)
        commit.setPosts(posts)

        setColors(
          sub.colorPrimary,
          sub.colorPrimaryLight,
          sub.colorPrimaryDark
        );
      } catch (error) {
        console.log(error);
        commit.subError(error.message as string);
      }
      commit.endLoading();
    },
    getSubByName: async (context, subName: string) => {
      const { commit } = subActionContext(context);
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
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
              name: subName,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const sub: Sub = data.subs[0]

        commit.setSub(sub)
        setColors(
          data.subs[0].colorPrimary,
          data.subs[0].colorPrimaryLight,
          data.subs[0].colorPrimaryDark
        );
      } catch (error) {
        console.log(error);
        commit.subError(error.message);
      }
      commit.endLoading();
    },
    createSub: async (context, sub: CreateSub) => {
      const { commit } = subActionContext(context);
      commit.startLoading();
      try {
        const req = await fetch(`/api/v1/subs/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sub),
        });

        const json = await req.json();

        if (json.success) {
          // commit("createSubSuccess", json.data);
          setColors(
            json.data.colorPrimary,
            json.data.colorPrimaryLight,
            json.data.colorPrimaryDark
          );
          router.push(`/s/${json.data.name}`);
        }
      } catch (error) {
        console.log(error);
        commit.subError(error.message);
      }
      commit.endLoading();
    },
    getSubs: async (context) => {
      const { commit } = subActionContext(context);
      commit.startLoading();
      try {
        const res = await fetch(`http://localhost/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
            `,
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const subs = data.subs as Sub[];

        commit.setSubsArr(subs);
      } catch (error) {
        console.log(error);
        commit.subError(error.message);
      }
      commit.endLoading();
    },
  },
  mutations: {
    startLoading: (state) => (state.isSubLoading = true),
    endLoading: (state) => (state.isSubLoading = false),
    setPosts: (state, posts: Post[]) => state.posts = posts,
    setSubsArr: (state, subs: Sub[]) => {
      state.subsArr = subs;
    },
    setSub: (state, sub: Sub) => (state.sub = sub),
    Sub_updatePostPoints: (state, post: Post) => {
      if (state.posts.length > 0) {
        const index = state.posts.findIndex((v) => {
          return v._id === post._id;
        });

        state.posts[index].points = post.points;
      }
    },
    subError: (state, error: string) => {
      state.subError = error;
      setTimeout(() => (state.subError = ""), 3000);
    },
  },
});

export default SubMod;
const subActionContext = (context: any) => moduleActionContext(context, SubMod); // eslint-disable-line
