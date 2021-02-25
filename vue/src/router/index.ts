import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
// import Sub from "../views/Sub.vue";
// import Thread from "../views/Thread.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  // {
  //   path: "/s/:sub",
  //   name: "Sub",
  //   component: Sub,
  // },
  // {
  //   path: "/s/:sub/comments/:id",
  //   name: "Comments",
  //   component: Thread,
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
