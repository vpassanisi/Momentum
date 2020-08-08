import Vue from "vue";
import Vuex from "vuex";
import darkMode from "./modules/darkMode";
import subState from "./modules/subState";
import postState from "./modules/postState";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    darkMode,
    subState,
    postState,
  },
});
