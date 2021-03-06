import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import NotFound from "../views/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: {
      title: "Home",
    },
  },
  {
    path: "/s/:sub",
    name: "Sub",
    component: () => import("../views/Sub.vue"),
  },
  {
    path: "/s/:sub/comments/:id",
    name: "Comments",
    component: () => import("../views/Thread.vue"),
  },
  {
    path: "/s/:sub/create",
    name: "Create Post",
    component: () => import("../views/CreatePost.vue"),
  },
  {
    path: "/subs/create",
    name: "Create Sub",
    component: () => import("../views/CreateSub.vue"),
  },
  {
    path: "/NotFound",
    name: "Not Found",
    component: NotFound,
    meta: {
      title: "Not Found",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
