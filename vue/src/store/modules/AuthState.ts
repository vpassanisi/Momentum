import { MutationTree, ActionTree, Module } from "vuex";
import router from "@/router/index";
import { RootState } from "../index";

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

const actions: ActionTree<AuthState, RootState> = {
  login: async ({ commit }, cred: Credencials) => {
    commit("startLoading");
    try {
      const res = await fetch("http://localhost/gql", {
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

      commit("loginSuccess", data.login.name);
      // router.go(0);
    } catch (error) {
      console.error(error);
      commit("loginFail", error.message);
    }
    commit("endLoading");
  },
  logout: async ({ commit }) => {
    commit("startLoading");
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

      const { errors, data } = await res.json();

      if (errors) throw Error(errors[0].message);

      if (!res.ok) throw Error(await res.text());

      commit("logoutSuccess");
      // router.go(0);
    } catch (error) {
      console.error(error);
      commit("logoutFail", error.message);
    }
    commit("endLoading");
  },
  me: async ({ commit }) => {
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

      if (errors) throw Error(errors[0].message);

      if (!res.ok) throw Error(await res.text());

      commit("meSuccess", data.me.name);
    } catch (error) {
      console.error(error.message);
      commit("meFail");
    }
  },
  register: async (
    { commit },
    newUser: { name: string; email: string; password: string }
  ) => {
    commit("startLoading");
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

      commit("registerSuccess", data.register.name);
    } catch (error) {
      console.log(error);
      commit("authError", error.message);
    }
    commit("endLoading");
  },
};

const mutations: MutationTree<AuthState> = {
  startLoading: (state) => (state.isAuthLoading = true),
  endLoading: (state) => (state.isAuthLoading = false),
  loginSuccess: (state, name) => {
    state.isAuthenticated = true;
    state.name = name;
  },
  loginFail: (state, error) => {
    state.authError = error;
    setTimeout(() => (state.authError = ""), 3000);
  },
  logoutSuccess: (state) => {
    state.isAuthenticated = false;
    state.name = "";
  },
  logoutFail: (state, error) => {
    state.authError = error;
    setTimeout(() => (state.authError = ""), 3000);
  },
  registerSuccess: (state, name) => {
    state.isAuthenticated = true;
    state.name = name;
  },
  authError: (state, error) => {
    state.authError = error;
    setTimeout(() => (state.authError = ""), 3000);
  },
  meSuccess: (state, name) => {
    state.isAuthenticated = true;
    state.name = name;
  },
  meFail: (state) => (state.isAuthenticated = false),
};

const module: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default module;
