import { ActionTree, MutationTree, Module } from "vuex";
import { RootState } from "../index";

const state = () => ({
  loginModal: false,
  registerModal: false,
  sidebar: false,
});

export type EventState = ReturnType<typeof state>;

const actions: ActionTree<EventState, RootState> = {
  openLoginModal({ commit }) {
    commit("openLoginModal");
  },
  closeLoginModal({ commit }) {
    commit("closeLoginModal");
  },
  openRegisterModal({ commit }) {
    commit("openRegisterModal");
  },
  closeRegisterModal({ commit }) {
    commit("closeRegisterModal");
  },
  openSidebar({ commit }) {
    commit("openSidebar");
  },
  closeSidebar({ commit }) {
    commit("closeSidebar");
  },
  getTimeSince({ commit }, date) {
    const seconds = Date.now() / 1000 - date;

    let time: number;

    switch (true) {
      case seconds / 31536000 > 1:
        time = Math.floor(seconds / 31536000);
        return `${time} ${time === 1 ? "year" : "years"}`;

      case seconds / 2592000 > 1:
        time = Math.floor(seconds / 2592000);
        return `${time} ${time === 1 ? "month" : "months"}`;

      case seconds / 86400 > 1:
        time = Math.floor(seconds / 86400);
        return `${time} ${time === 1 ? "day" : "days"}`;

      case seconds / 3600 > 1:
        time = Math.floor(seconds / 3600);
        return `${time} ${time === 1 ? "hour" : "hours"}`;

      case seconds / 60 > 1:
        time = Math.floor(seconds / 60);
        return `${time} ${time === 1 ? "minute" : "minutes"}`;

      default:
        time = Math.floor(seconds);
        return `${time} ${time === 1 ? "second" : "seconds"}`;
    }
  },
};

const mutations: MutationTree<EventState> = {
  openLoginModal: (state) => (state.loginModal = true),
  closeLoginModal: (state) => (state.loginModal = false),
  openRegisterModal: (state) => (state.registerModal = true),
  closeRegisterModal: (state) => (state.registerModal = false),
  openSidebar: (state) => (state.sidebar = true),
  closeSidebar: (state) => (state.sidebar = false),
};

const module: Module<EventState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default module;
