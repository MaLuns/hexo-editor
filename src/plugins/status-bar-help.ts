import type { Plugin } from "@/core/plugin";
import { InfoSquare } from "@vicons/tabler";
import markdowns from "@/assets/markdown.json";
import HelpInfo from "@/components/HelpInfo.vue";
import AboutInfo from "@/components/AboutInfo.vue";

export default <Plugin>{
	name: "status-bar-help",
	register: (ctx) => {
		ctx.statusBar.tapMenus((menus) => {
			menus["status-bar-help"] = {
				id: "status-bar-help",
				position: "right",
				title: "帮助",
				icon: InfoSquare,
				list: [
					{
						id: "show-premium",
						title: "语法参考",
						type: "normal",
						onClick: () => {
							const keys = ctx.commnad
								.getCommands()
								.filter((item) => item.keybinding)
								.map((item) => {
									return {
										title: item.title,
										keybindLabel: item.keybindLabel!,
									};
								});

							ctx.discrete.dialog.create({
								showIcon: false,
								closable: false,
								autoFocus: false,
								transformOrigin: "center",
								style: {
									position: "fixed",
									width: "860px",
									top: "100px",
									left: "50vw",
									transform: "translateX(-50%)",
									padding: "0 20px 20px",
								},
								content: () => h(HelpInfo, { keybinds: keys, mds: markdowns }),
							});
						},
					},
					{
						id: "show-premium",
						title: "关于 Hexo-Editor",
						type: "normal",
						onClick: () => {
							ctx.discrete.dialog.create({
								showIcon: false,
								closable: false,
								autoFocus: false,
								style: {
									textAlign: "center",
									position: "fixed",
									top: "100px",
									left: "50vw",
									transform: "translateX(-50%)",
								},
								content: () => h(AboutInfo),
							});
						},
					},
				],
			};
		});
	},
};
