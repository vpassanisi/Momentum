/* eslint-disable @typescript-eslint/no-use-before-define */
import { defineModule } from "direct-vuex";
import { moduleActionContext } from "../index";

const state = () => ({
  isDarkMode: false,
});

export type DarkModeState = ReturnType<typeof state>;

const DarkModeMod = defineModule({
  state,
  actions: {
    turnOn: (context) => {
      const { commit } = darkModeActionContext(context);
      document.documentElement.classList.add("dark");

      commit.setOn();
    },
    turnOff: (context) => {
      const { commit } = darkModeActionContext(context);
      document.documentElement.classList.remove("dark");

      commit.setOff();
    },
  },
  mutations: {
    setOn: (state) => (state.isDarkMode = true),
    setOff: (state) => (state.isDarkMode = false),
  },
});

export default DarkModeMod;
const darkModeActionContext = (
  context: any // eslint-disable-line
) => moduleActionContext(context, DarkModeMod);
