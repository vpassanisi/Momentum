import DarkModeMod from "./modules/DarkMode";
import DataMod from "./modules/DataState";
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
    DataMod,
    PointMod,
    DarkModeMod,
    AuthMod,
    EventMod,
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
