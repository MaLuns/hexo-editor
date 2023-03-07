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
				list: [
					/* {
						id: "status-bar-insert",
						type: "normal",
						title: "插入当前时间",
					},
					{
						id: "status-bar-insert",
						type: "normal",
						title: "插入当前时间",
					},
					{
						type: "separator",
					},
					{
						id: "status-bar-insert.time",
						type: "normal",
						title: "插入当前时间",
					},
					{
						id: "status-bar-insert.date",
						type: "normal",
						title: "插入当前日期",
					}, */
				],
			};
		});
	},
};
