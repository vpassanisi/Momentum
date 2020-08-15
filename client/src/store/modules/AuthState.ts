import { MutationTree, ActionTree } from "vuex";

interface AuthState {
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
          commit("loginSuccess");
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
          commit("meSuccess");
        } else {
          commit("meFail");
        }
      } catch (error) {
        console.error(error);
      }
    },
  } as ActionTree<AuthState, any>,
  mutations: {
    startLoading: (state) => (state.isAuthLoading = true),
    endLoading: (state) => (state.isAuthLoading = false),
    loginSuccess: (state) => (state.isAuthenticated = true),
    loginFail: (state, error) => {
      state.authError = error;
      setTimeout(() => (state.authError = null), 3000);
    },
    logoutSuccess: (state) => (state.isAuthenticated = false),
    logoutFail: (state, error) => {
      state.authError = error;
      setTimeout(() => (state.authError = null), 3000);
    },
    meSuccess: (state) => (state.isAuthenticated = true),
    meFail: (state) => (state.isAuthenticated = false),
  } as MutationTree<AuthState>,
};

export default module;
