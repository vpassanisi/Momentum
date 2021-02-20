import { GetterTree, MutationTree, ActionTree, Module } from "vuex";
import type {RootState} from "../index"

const state = () => ({
  isDarkMode: false,
});

export type DarkModeState = ReturnType<typeof state>;

const getters: GetterTree<DarkModeState, RootState> = {
  isDarkMode: (state) => state.isDarkMode,
};

const actions: ActionTree<DarkModeState, RootState> = {
  turnOn: ({ commit }) => {
    document.documentElement.classList.add("dark");

    commit("setOn");
  },
  turnOff: ({ commit }) => {
    document.documentElement.classList.remove("dark");

    commit("setOff");
  },
};

const mutations: MutationTree<DarkModeState> = {
  setOn: (state) => (state.isDarkMode = true),
  setOff: (state) => (state.isDarkMode = false),
};

const module: Module<DarkModeState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default module
