import { MutationTree, ActionTree } from "vuex";

interface AuthState {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  error: string | null;
}

interface Credencials {
  email: string;
  password: string;
}

const module = {
  namespaced: true,
  state: {
    isAuthenticated: null,
    isLoading: false,
    error: null,
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
          commit("loignFail");
        }
      } catch (error) {
        commit("loignFail");
        console.log(error);
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
        }
      } catch (error) {
        console.log(error);
      }
      commit("endLoading");
    },
  } as ActionTree<AuthState, any>,
  mutations: {
    startLoading: (state) => (state.isLoading = true),
    endLoading: (state) => (state.isLoading = false),
    loginSuccess: (state) => (state.isAuthenticated = true),
    loignFail: (state) => (state.isAuthenticated = false),
    logoutSuccess: (state) => (state.isAuthenticated = false),
  } as MutationTree<AuthState>,
};

export default module;
