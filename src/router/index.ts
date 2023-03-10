import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { fileStore } from "@/store";
import { Files, Settings, Stack2 } from "@vicons/tabler";
import HomeView from "../views/home/index.vue";

export const siderPage: RouteRecordRaw[] = [
	{
		path: "",
		name: "editer",
		meta: {
			icon: markRaw(Files),
			tips: "文章管理",
		},
		component: () => import("../views/editor/index.vue"),
	},
	{
		path: "assets",
		name: "assets",
		meta: {
			icon: markRaw(Stack2),
			tips: "资源文件管理",
		},
		component: () => import("../views/assets/index.vue"),
	},
	{
		path: "config",
		name: "config",
		meta: {
			icon: markRaw(Settings),
			tips: "配置管理",
		},
		component: () => import("../views/config/index.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/editer",
			component: () => import("../components/layout/index.vue"),
			children: siderPage,
		},
	],
});

router.beforeEach((to, from, next) => {
	if (to.name !== "home" && !fileStore.fs) next({ name: "home" });
	else next();
});

export default router;
