import Vue from "vue";
import Vuex from "vuex";
import darkMode from "./modules/darMode";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    darkMode,
  },
});
