import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Sub from "../views/Sub.vue";
import Thread from "../views/Thread.vue";
import CreatePost from "../views/CreatePost.vue";
import CreateSub from "../views/CreateSub.vue";
import NotFound from "../views/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/s/:sub",
    name: "Sub",
    component: Sub,
  },
  {
    path: "/s/:sub/comments/:id",
    name: "Comments",
    component: Thread,
  },
  {
    path: "/s/:sub/create",
    name: "Create Post",
    component: CreatePost,
  },
  {
    path: "/subs/create",
    name: "Create Sub",
    component: CreateSub,
  },
  {
    path: "/NotFound",
    name: "Not Found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
