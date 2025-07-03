import { createRouter, createWebHistory } from "vue-router";

export const routes = [
  {
    name: "Latest",
    path: "/latest",
    component: () => import("../views/SeshReviewView.vue"),
    icon: "mdi-chevron-left",
  },
  {
    name: "Settings",
    path: "/settings",
    component: () => import("../views/SettingsView.vue"),
    icon: "mdi-cog",
  },
  {
    name: "Breev",
    path: "/",
    component: () => import("../views/BreevView.vue"),
    icon: "mdi-timer",
  },
  {
    name: "History",
    path: "/history",
    component: () => import("../views/HistoryView.vue"),
    icon: "mdi-history",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
