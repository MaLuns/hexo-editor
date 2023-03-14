import type { Plugin } from "@/core/plugin";
import type { MenuItem } from "@/core/status-bar";
import { formatDate } from "@/utils";
import markdown from "@/assets/markdown.json";

export default <Plugin>{
	name: "editor-md",
	register(ctx) {
		const monaco = ctx.editor.getMonaco();

		const list = [
			{
				title: "插入当前日期",
				keybinding: [monaco.KeyMod.Shift, monaco.KeyMod.Alt, monaco.KeyCode.KeyQ],
				run() {
					const editor = ctx.editor.getEditor();
					editor && ctx.editor.tools.insert(editor, formatDate(new Date(), "hh:mm:ss"));
				},
			},
			{
				title: "插入当前时间",
				keybinding: [monaco.KeyMod.Shift, monaco.KeyMod.Alt, monaco.KeyCode.KeyW],
				run() {
					const editor = ctx.editor.getEditor();
					editor && ctx.editor.tools.insert(editor, formatDate(new Date(), "YYYY-MM-DD"));
				},
			},
			{
				title: "插入当前时间",
				keybinding: [monaco.KeyMod.Shift, monaco.KeyMod.Alt, monaco.KeyCode.KeyE],
				run() {
					const editor = ctx.editor.getEditor();
					editor && ctx.editor.tools.insert(editor, formatDate(new Date(), "YYYY-MM-DD hh:mm:ss"));
				},
			},
		];

		ctx.hook.registerHook("MONACO_MARKDOWN_READY", function (e) {
			ctx.editor.registerSingleAction(e.editor, {
				id: "plugin.editor.format",
				label: "格式化文档",
				keybindings: [monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
				contextMenuGroupId: "format",
				run(editor) {
					editor.getAction("editor.action.formatDocument")?.run();
				},
			});
			ctx.editor.registerSingleAction(e.editor, {
				id: "plugin.editor.restore",
				label: "恢复原文档",
				keybindings: [monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ],
				contextMenuGroupId: "format",
				run(editor) {
					ctx.hook.triggerHook("RESTORE_DEFAULT_DOCUMENT", editor);
				},
			});
			list.forEach((item, index) => {
				ctx.editor.registerSingleAction(e.editor, {
					id: `plugin.editor.insert-date-tiem.${index}`,
					label: item.title,
					keybindings: ctx.editor.getKeysbinding(item.keybinding),
					contextMenuGroupId: "insert-date",
					run: item.run,
				});
			});

			markdown.forEach((item, index) => {
				ctx.editor.registerSingleAction(e.editor, {
					id: `plugin.editor.markdown.${index}`,
					label: item.label,
					contextMenuGroupId: "insert-markdown",
					contextMenuOrder: index,
					run(editor) {
						ctx.editor.tools.insert(editor, item.syntax ? item.syntax : item.value, Boolean(item.syntax));
					},
				});
			});
		});

		ctx.statusBar.tapMenus((menus) => {
			menus["status-bar-insert"]?.list?.push(
				...list.map((item, index) => {
					return {
						id: `plugin.editor.markdown.${index}`,
						type: "normal",
						title: item.title,
						subTitle: ctx.editor.getKeysLabel(item.keybinding),
						onClick() {
							item.run();
						},
					} as MenuItem;
				}),
				{
					type: "separator",
				},
				...markdown.map((item, index) => {
					return {
						id: `plugin.editor.markdown.${index}`,
						type: "normal",
						title: item.label,
						onClick() {
							const editor = ctx.editor.getEditor();
							editor && ctx.editor.tools.insert(editor, item.value);
						},
					} as MenuItem;
				})
			);
		});
	},
};
