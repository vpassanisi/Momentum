import { GetterTree, MutationTree, ActionTree } from "vuex";

interface DarkModeState {
  isDarkMode: boolean;
}

const module = {
  namespaced: true,
  state: {
    isDarkMode: false,
  },
  getter: {
    isDarkMode: (state) => state.isDarkMode,
  } as GetterTree<DarkModeState, null>,
  actions: {
    turnOn: ({ commit }) => {
      document.documentElement.classList.add("mode-dark");

      commit("setOn");
    },
    turnOff: ({ commit }) => {
      document.documentElement.classList.remove("mode-dark");

      commit("setOff");
    },
  } as ActionTree<DarkModeState, null>,
  mutations: {
    setOn: (state: DarkModeState) => (state.isDarkMode = true),
    setOff: (state: DarkModeState) => (state.isDarkMode = false),
  } as MutationTree<DarkModeState>,
};

export default module;
