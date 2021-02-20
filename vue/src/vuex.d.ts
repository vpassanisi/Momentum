import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import { DarkModeState } from "./store/modules/DarkMode";
import { SubState } from "./store/modules/SubState";
import { EventState } from "./store/modules/EventState";
import { AuthState } from "./store/modules/AuthState";
import { PostState } from "./store/modules/PostState";

declare module "@vue/runtime-core" {
  interface State {
    DarkModeState: DarkModeState;
    SubState: SubState;
    EventState: EventState;
    AuthState: AuthState;
    PostState: PostState;
  }
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
