import type { Plugin } from "@/core/plugin";
import type { MenuItem } from "@/core/status-bar";

export default <Plugin>{
	name: "editor-keyboard",
	register(ctx) {
		const configStore = ctx.store.configStore;
		const monaco = ctx.editor.getMonaco();

		const list = [
			{
				id: "status-bar-view.mouse-wheel-zoom",
				title: "滚轮缩放",
				keybinding: [monaco.KeyMod.CtrlCmd, monaco.KeyMod.Alt, monaco.KeyCode.KeyZ],
				checked: computed(() => configStore.editorOption.mouseWheelZoom),
				onClick: () => {
					configStore.editorOption.mouseWheelZoom = !configStore.editorOption.mouseWheelZoom;
				},
			},
			{
				id: "status-bar-view.linenumbers",
				title: "显示行号",
				keybinding: [monaco.KeyMod.Alt, monaco.KeyCode.KeyL],
				checked: computed(() => configStore.editorOption.lineNumbers === "on"),
				onClick: () => {
					configStore.editorOption.lineNumbers = configStore.editorOption.lineNumbers === "off" ? "on" : "off";
				},
			},
			{
				id: "status-bar-view.wordwrap",
				title: "文本换行",
				type: "normal",
				keybinding: [monaco.KeyMod.Alt, monaco.KeyCode.KeyZ],
				checked: computed(() => configStore.editorOption.wordWrap === "on"),
				onClick: () => {
					configStore.editorOption.wordWrap = configStore.editorOption.wordWrap === "off" ? "on" : "off";
				},
			},
		];

		ctx.hook.registerHook("MONACO_MARKDOWN_READY", function (e) {
			list.forEach((item) => {
				ctx.editor.registerSingleCommand(e.editor, {
					keybinding: ctx.editor.getKeysbinding(item.keybinding)[0],
					handler: item.onClick,
				});
			});
		});
		list.forEach((item) => {
			const command: CommandPalette = {
				title: item.title,
				key: item.id,
				desc: ctx.editor.getKeysLabel(item.keybinding),
				handle: item.onClick,
			};
			ctx.commnad.registerCommand(command);
		});
		ctx.statusBar.tapMenus((menus) => {
			menus["status-bar-view"]?.list?.unshift(
				...list.map((item) => {
					return {
						type: "normal",
						...item,
						subTitle: ctx.editor.getKeysLabel(item.keybinding),
					} as MenuItem;
				}),
				{
					type: "separator",
				}
			);
		});
	},
};
