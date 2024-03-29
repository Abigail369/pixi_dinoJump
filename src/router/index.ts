import { createRouter, createWebHistory } from "vue-router";

let routes = [
  {
    path: "/",
    redirect: "/dino",
  },
  {
    path: "/dino",
    name: "dino",
    component: () => import("../components/dino/index.vue"),
  },
];
// 路由
const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 导出
export default router;
