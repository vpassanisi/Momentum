import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Sub from "@/views/Sub.vue";
import Thread from "@/views/Thread.vue";
import CreatePost from "@/views/CreatePost.vue";
import CreateSub from "@/views/CreateSub.vue";
import NotFound from "@/views/NotFound.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
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
    path: "/s/:sub/create",
    name: "Create Post",
    component: CreatePost,
  },
  {
    path: "/s/:sub/comments/:id",
    name: "Comments",
    component: Thread,
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
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
