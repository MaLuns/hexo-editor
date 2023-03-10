import type { Plugin } from "@/core/plugin";
import type { Menus } from "@/core/status-bar";
import { Sunny, Moon, Contrast } from "@vicons/ionicons5";

export default <Plugin>{
	name: "status-bar-theme",
	register: (ctx) => {
		ctx.statusBar.tapMenus((menus: Menus) => {
			const icon = {
				light: Sunny,
				dark: Moon,
				system: Contrast,
			};

			const message = {
				light: "亮白",
				dark: "暗黑",
				system: "跟随系统",
			};

			menus["status-bar-theme"] = {
				id: "status-bar-theme",
				position: "right",
				tips: "主题切换",
				title: "主题",
				icon: defineComponent({
					render() {
						return h(icon[ctx.store.configStore.theme]);
					},
				}),
				onClick() {
					const nextTheme = {
						light: "dark",
						dark: "system",
						system: "light",
					}[ctx.store.configStore.theme] as "light" | "dark" | "system";

					ctx.discrete.message.info(`主题切换为${message[nextTheme]}模式`);
					ctx.store.configStore.theme = nextTheme;
				},
			};
		});
	},
};
