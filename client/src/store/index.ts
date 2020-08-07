import Vue from "vue";
import Vuex from "vuex";
import darkMode from "./modules/darkMode";
import currentSub from "./modules/currentSub";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    darkMode,
    currentSub,
  },
});
