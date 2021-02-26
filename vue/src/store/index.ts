import DarkModeMod from "./modules/DarkMode";
import SubMod from "./modules/SubState";
import PostMod from "./modules/PostState";
import CommentMod from "./modules/CommentState";
import PointMod from "./modules/PointState";
import AuthMod from "./modules/AuthState";
import EventMod from "./modules/EventState";
import { createDirectStore } from "direct-vuex";

const {
  store,
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext,
} = createDirectStore({
  state: {
    version: 0.1,
  },
  modules: {
    SubMod,
    DarkModeMod,
    AuthMod,
    EventMod,
    PostMod,
    PointMod,
    CommentMod,
  },
});

export default store;

export {
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext,
};

export type AppStore = typeof store;
declare module "@vue/runtime-core" {
  // provide typings for `this.$store`
  interface Store {
    direct: AppStore;
  }
  interface ComponentCustomProperties {
    $store: Store;
  }
}
