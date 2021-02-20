import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import { DarkModeState } from "./store/modules/DarkMode";
import { SubState } from "./store/modules/SubState";

declare module "@vue/runtime-core" {
  interface State {
    DarkModeState: DarkModeState;
    SubState: SubState;
  }
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
