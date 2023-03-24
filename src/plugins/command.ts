import type { Plugin } from "@/core/plugin";
import { styleConfig, editorConfig, otherConfig } from "@/utils/config";

export default <Plugin>{
	name: "command",
	register(ctx) {
		[...styleConfig, ...editorConfig, ...otherConfig].forEach((item) => {
			if (item.isCommand) {
				const command: CommandPalette = {
					title: item.title,
					id: item.key,
				};

				if (item.type === "select") {
					command.children = item.attr!.options!.map<CommandPalette>((opt) => {
						return {
							title: opt.label,
							id: opt.value,
							handle: (t) => {
								if (item.attr && item.attr["on-update:value"]) {
									item.attr["on-update:value"](t.id);
								}
							},
						};
					});
				}
				ctx.commnad.registerCommand(command);
			}
		});
	},
};
