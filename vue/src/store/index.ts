import { createStore } from "vuex";
import DarkModeState from "./modules/DarkMode";
import SubState from "./modules/SubState";
import PostState from "./modules/PostState";
import CommentState from "./modules/CommentState";
import PointState from "./modules/PointState";
import AuthState from "./modules/AuthState";
import MediaQueryState from "./modules/MediaQueryState";
import EventState from "./modules/EventState";

export interface RootState {
  version: number;
}

const store = createStore<RootState>({
  state: {
    version: 0.1,
  },
  modules: {
    DarkModeState,
    SubState,
  },
});

export default store;
