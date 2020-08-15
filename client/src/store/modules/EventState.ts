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
    getTimeSince({ commit }, date) {
      const seconds = Date.now() / 1000 - date;

      switch (true) {
        case seconds / 31536000 > 1:
          return `${Math.floor(seconds / 31536000)} years`;

        case seconds / 2592000 > 1:
          return `${Math.floor(seconds / 2592000)} months`;

        case seconds / 86400 > 1:
          return `${Math.floor(seconds / 86400)} days`;

        case seconds / 3600 > 1:
          return `${Math.floor(seconds / 3600)} hours`;

        case seconds / 60 > 1:
          return `${Math.floor(seconds / 60)} minutes`;

        default:
          return `${Math.floor(seconds)} seconds`;
      }
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
