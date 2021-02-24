import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import { DarkModeState } from "./store/modules/DarkMode";
import { SubState } from "./store/modules/SubState";
import { EventState } from "./store/modules/EventState";
import { AuthState } from "./store/modules/AuthState";
import { PostState } from "./store/modules/PostState";
import { PointState } from "./store/modules/PointState";
import { CommentState } from "./store/modules/CommentState";

declare module "@vue/runtime-core" {
  interface State {
    DarkModeState: DarkModeState;
    SubState: SubState;
    EventState: EventState;
    AuthState: AuthState;
    PostState: PostState;
    PointState: PointState;
    CommentState: CommentState;
  }
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
