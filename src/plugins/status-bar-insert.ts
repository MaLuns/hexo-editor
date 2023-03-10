import type { Plugin } from "@/core/plugin";
import { CodePlus } from "@vicons/tabler";

export default <Plugin>{
	name: "status-bar-insert",
	register(ctx) {
		ctx.statusBar.tapMenus((menus) => {
			menus["status-bar-insert"] = {
				id: "status-bar-insert",
				position: "left",
				title: "插入",
				icon: CodePlus,
				hidden: computed(() => !Boolean(ctx.store.fileStore.post)),
				list: [],
			};
		});
	},
};
