import Vue from "vue";
import Vuex from "vuex";
import DarkMode from "./modules/DarkMode";
import SubState from "./modules/SubState";
import PostState from "./modules/PostState";
import CommentState from "./modules/CommentState";
import PointState from "./modules/PointState";
import AuthState from "./modules/AuthState";
import MediaQueryState from "./modules/MediaQueryState";
import EventState from "./modules/EventState";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    DarkMode,
    SubState,
    PostState,
    CommentState,
    PointState,
    AuthState,
    MediaQueryState,
    EventState,
  },
});
