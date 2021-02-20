import { MutationTree, ActionTree } from "vuex";
import router from "@/router/index";

interface AuthState {
  name: string | null;
  isAuthenticated: boolean | null;
  isAuthLoading: boolean;
  authError: string | null;
}

interface Credencials {
  email: string;
  password: string;
}

const module = {
  namespaced: true,
  state: {
    name: null,
    isAuthenticated: null,
    isAuthLoading: false,
    authError: null,
  },
  actions: {
    login: async ({ commit }, cred: Credencials) => {
      commit("startLoading");
      try {
        const res = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cred),
        });

        const json = await res.json();

        if (json.success) {
          commit("loginSuccess", json.data.name);
          router.go(0);
        } else {
          commit("loginFail", json.message);
        }
      } catch (error) {
        commit("loginFail", "Proimise rejected with an error");
        console.error(error);
      }
      commit("endLoading");
    },
    logout: async ({ commit }) => {
      commit("startLoading");
      try {
        const res = await fetch("/api/v1/auth/", {
          method: "POST",
        });

        const json = await res.json();

        if (json.success) {
          commit("logoutSuccess");
          router.go(0);
        } else {
          commit("logoutFail", json.message);
        }
      } catch (error) {
        commit("logoutFail", "Promise rejected with an error");
        console.error(error);
      }
      commit("endLoading");
    },
    me: async ({ commit }) => {
      try {
        const res = await fetch("/api/v1/auth", {
          method: "GET",
        });

        const json = await res.json();

        if (json.success) {
          commit("meSuccess", json.data.name);
        } else {
          commit("meFail");
        }
      } catch (error) {
        console.error(error);
      }
    },
    register: async ({ commit }, newUser) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        const json = await res.json();

        if (json.success) {
          commit("registerSuccess", json.data.name);
        } else {
          commit("authError", json.message);
        }
      } catch (error) {
        console.log(error);
        commit("authError", "Promise rejected with an error");
      }
      commit("endLoading");
    },
  } as ActionTree<AuthState, any>,
  mutations: {
    startLoading: (state) => (state.isAuthLoading = true),
    endLoading: (state) => (state.isAuthLoading = false),
    loginSuccess: (state, name) => {
      state.isAuthenticated = true;
      state.name = name;
    },
    loginFail: (state, error) => {
      state.authError = error;
      setTimeout(() => (state.authError = null), 3000);
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.name = null;
    },
    logoutFail: (state, error) => {
      state.authError = error;
      setTimeout(() => (state.authError = null), 3000);
    },
    registerSuccess: (state, name) => {
      state.isAuthenticated = true;
      state.name = name;
    },
    authError: (state, error) => {
      state.authError = error;
      setTimeout(() => (state.authError = null), 3000);
    },
    meSuccess: (state, name) => {
      state.isAuthenticated = true;
      state.name = name;
    },
    meFail: (state) => (state.isAuthenticated = false),
  } as MutationTree<AuthState>,
};

export default module;
