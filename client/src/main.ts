import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueMq from "vue-mq";

import "./css/tailwind.css";

Vue.use(VueMq, {
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: Infinity,
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
