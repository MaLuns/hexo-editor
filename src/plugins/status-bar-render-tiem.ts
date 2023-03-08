import type { Plugin } from "@/core/plugin";
import type { Menus } from "@/core/status-bar";
import { TimeOutline } from "@vicons/ionicons5";
import { registerHook } from "@/core/hook";
import { ref } from "vue";

export default <Plugin>{
	name: "status-bar-render-tiem",
	register: (ctx) => {
		const title = ref("");
		ctx.statusBar.tapMenus((menus: Menus) => {
			let tiem = new Date();
			registerHook("MARKDOWN_RENDER_BEFORE", () => {
				tiem = new Date();
			});
			registerHook("MARKDOWN_RENDER_AFTER", () => {
				const nowDate = new Date();
				console.log();
				title.value = `${nowDate.getTime() - tiem.getTime()}ms`;
			});
			menus["status-bar-render-tiem"] = {
				id: "status-bar-render-tiem",
				position: "right",
				title: title,
				icon: TimeOutline,
				tips: "Markdown 渲染耗时",
			};
		});
	},
};
