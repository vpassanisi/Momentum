/* eslint-disable @typescript-eslint/no-use-before-define */

import router from "@/router";
import { defineModule } from "direct-vuex";
import { moduleActionContext } from "../index";

interface Credencials {
  email: string;
  password: string;
}

const state = () => ({
  name: "",
  isAuthenticated: false,
  isAuthLoading: false,
  authError: "",
});

export type AuthState = ReturnType<typeof state>;

const AuthMod = defineModule({
  state,
  actions: {
    login: async (context, cred: Credencials) => {
      const { commit } = authActionContext(context); // eslint-disable-line
      commit.startLoading();
      try {
        const res = await fetch("/gql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query Input($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                _id
                name
                email
                createdAt
              }
            }
            `,
            variables: {
              email: cred.email,
              password: cred.password,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        if (!res.ok) throw Error(await res.text());

        const name: string = data.login.name;

        commit.login(name);
        router.go(0);
      } catch (error) {
        console.error(error);
        commit.setAuthError(error.message);
      }
      commit.endLoading();
    },
    logout: async (context) => {
      const { commit } = authActionContext(context); // eslint-disable-line
      commit.startLoading();
      try {
        const res = await fetch("/gql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                logOut
              }
              `,
          }),
        });

        const { errors } = await res.json();

        if (errors) throw Error(errors[0].message);

        if (!res.ok) throw Error(await res.text());

        commit.logout();
        router.go(0);
      } catch (error) {
        console.error(error);
        commit.setAuthError(error.message);
      }
      commit.endLoading();
    },
    me: async (context) => {
      const { commit } = authActionContext(context); // eslint-disable-line
      try {
        const res = await fetch("/gql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                me {
                  _id
                  name
                  email
                  createdAt
                }
              }
              `,
          }),
        });

        const { errors, data } = await res.json();

        if (errors) {
          console.log(errors[0].message);
          return;
        }

        if (!res.ok) throw Error(await res.text());

        const name: string = data.me.name;

        commit.login(name);
      } catch (error) {
        console.error(error.message);
        commit.setAuthError(error.message);
      }
    },
    register: async (
      context,
      newUser: { name: string; email: string; password: string }
    ) => {
      const { commit } = authActionContext(context); // eslint-disable-line
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation Input($name: String!, $email: String!, $password: String!) {
              register(name: $name, email: $email, password: $password){
                  _id
                  name
                  email
                  createdAt
              }
          }`,
            variables: {
              name: newUser.name,
              email: newUser.email,
              password: newUser.password,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        if (!res.ok) throw Error(await res.text());

        const name: string = data.register.name;

        commit.login(name);
      } catch (error) {
        console.log(error);
        commit.setAuthError(error.message);
      }
      commit.endLoading();
    },
  },
  mutations: {
    startLoading: (state) => (state.isAuthLoading = true),
    endLoading: (state) => (state.isAuthLoading = false),
    login: (state, name: string) => {
      state.isAuthenticated = true;
      state.name = name;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = "";
    },
    setAuthError: (state, error: string) => {
      state.authError = error;
      setTimeout(() => (state.authError = ""), 3000);
    },
  },
});

export default AuthMod;
const authActionContext = (
  context: any // eslint-disable-line
) => moduleActionContext(context, AuthMod);
