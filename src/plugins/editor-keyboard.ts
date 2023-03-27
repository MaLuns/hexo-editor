import type { Plugin } from "@/core/plugin";

export default <Plugin>{
	name: "editor-keyboard",
	register(ctx) {
		const configStore = ctx.store.configStore;
		const monaco = ctx.editor.getMonaco();

		const keyboardList = [
			{
				id: "status-bar-view.mouse-wheel-zoom",
				title: "滚轮缩放",
				keybinding: [monaco.KeyMod.CtrlCmd, monaco.KeyMod.Alt, monaco.KeyCode.KeyZ],
				checked: computed(() => configStore.editorOption.mouseWheelZoom),
				onClick: () => {
					configStore.editorOption.mouseWheelZoom = !configStore.editorOption.mouseWheelZoom;
					ctx.discrete.message.info(`${configStore.editorOption.mouseWheelZoom ? "开启" : "关闭"}滚轮缩放`);
				},
			},
			{
				id: "status-bar-view.linenumbers",
				title: "显示行号",
				keybinding: [monaco.KeyMod.Alt, monaco.KeyCode.KeyJ],
				checked: computed(() => configStore.editorOption.lineNumbers === "on"),
				onClick: () => {
					configStore.editorOption.lineNumbers = configStore.editorOption.lineNumbers === "off" ? "on" : "off";
					ctx.discrete.message.info(`${configStore.editorOption.lineNumbers === "on" ? "显示" : "隐藏"}行号`);
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
					ctx.discrete.message.info(`${configStore.editorOption.wordWrap === "on" ? "强制" : "取消"}文本换行`);
				},
			},
		];

		keyboardList.forEach((item) => {
			const command: CommandPalette = {
				id: item.id,
				title: item.title,
				keybindLabel: ctx.editor.getKeysLabel(item.keybinding, "|").split("|"),
				keybinding: ctx.editor.getKeysbinding(item.keybinding),
				handle: item.onClick,
			};
			ctx.commnad.registerCommand(command);
		});

		ctx.statusBar.tapMenus((menus) => {
			menus["status-bar-view"]?.list?.unshift(
				...keyboardList.map((item) => {
					return {
						type: "normal",
						...item,
						subTitle: ctx.editor.getKeysLabel(item.keybinding, "+"),
					} as StatusMenuItem;
				}),
				{
					type: "separator",
				}
			);
		});
	},
};
