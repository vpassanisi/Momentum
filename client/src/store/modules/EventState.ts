import { ActionTree, MutationTree } from "vuex";

interface EventState {
  loginModal: boolean;
  sidebar: boolean;
}

const module = {
  namespaced: true,
  state: {
    loginModal: false,
    sidebar: false,
  },
  actions: {
    openLoginModal({ commit }) {
      commit("openLoginModal");
    },
    closeLoginModal({ commit }) {
      commit("closeLoginModal");
    },
    openSidebar({ commit }) {
      commit("openSidebar");
    },
    closeSidebar({ commit }) {
      commit("closeSidebar");
    },
  } as ActionTree<EventState, any>,
  mutations: {
    openLoginModal: (state) => (state.loginModal = true),
    closeLoginModal: (state) => (state.loginModal = false),
    openSidebar: (state) => (state.sidebar = true),
    closeSidebar: (state) => (state.sidebar = false),
  } as MutationTree<EventState>,
};

export default module;
