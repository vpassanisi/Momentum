import { MutationTree, ActionTree } from "vuex";

interface MediaQueryState {
  mq: string;
}

const module = {
  namespaced: true,
  state: {
    mq: "",
  },
  actions: {
    init: ({ commit }) => {
      window.addEventListener("resize", () => commit("setMQ"));
      commit("setMQ");
    },
  } as ActionTree<MediaQueryState, any>,
  mutations: {
    setMQ(state) {
      const w = window.innerWidth;
      switch (true) {
        case w < 640:
          state.mq = "sm";
          break;
        case w < 768:
          state.mq = "md";
          break;
        case w < 1024:
          state.mq = "lg";
          break;
        case w < 1280:
          state.mq = "xl";
          break;
        default:
          state.mq = "xl";
      }
    },
  } as MutationTree<MediaQueryState>,
};

export default module;
