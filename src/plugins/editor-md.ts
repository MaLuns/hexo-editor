import type { Plugin } from "@/core/plugin";
import type * as Monaco from "monaco-editor";
import { formatDate } from "@/utils";
import markdown from "@/assets/markdown.json";

export default <Plugin>{
	name: "editor-md",
	register(ctx) {
		const monaco = ctx.editor.getMonaco();

		const insertList: Monaco.editor.IActionDescriptor[] = [
			{
				id: "plugin.editor.insert-date-tiem.1",
				label: "插入当前时间",
				keybindings: [monaco.KeyMod.Shift, monaco.KeyMod.Alt, monaco.KeyCode.KeyQ],
				run() {
					const editor = ctx.editor.getEditor();
					editor && ctx.editor.tools.insert(editor, formatDate(new Date(), "hh:mm:ss"));
				},
			},
			{
				id: "plugin.editor.insert-date-tiem.2",
				label: "插入当前日期",
				keybindings: [monaco.KeyMod.Shift, monaco.KeyMod.Alt, monaco.KeyCode.KeyW],
				run() {
					const editor = ctx.editor.getEditor();
					editor && ctx.editor.tools.insert(editor, formatDate(new Date(), "YYYY-MM-DD"));
				},
			},
			{
				id: "plugin.editor.insert-date-tiem.3",
				label: "插入完整日期",
				keybindings: [monaco.KeyMod.Shift, monaco.KeyMod.Alt, monaco.KeyCode.KeyE],
				run() {
					const editor = ctx.editor.getEditor();
					editor && ctx.editor.tools.insert(editor, formatDate(new Date(), "YYYY-MM-DD hh:mm:ss"));
				},
			},
		];

		const formatList: Monaco.editor.IActionDescriptor[] = [
			{
				id: "plugin.editor.format",
				label: "格式化文档",
				keybindings: [monaco.KeyMod.Shift, monaco.KeyMod.Alt, monaco.KeyCode.KeyF],
				contextMenuGroupId: "format",
				run() {
					const editor = ctx.editor.getEditor();
					editor && editor.getAction("editor.action.formatDocument")?.run();
				},
			},
			{
				id: "plugin.editor.restore",
				label: "恢复原文档",
				keybindings: [monaco.KeyMod.Shift, monaco.KeyMod.Alt, monaco.KeyCode.KeyZ],
				contextMenuGroupId: "format",
				run() {
					const editor = ctx.editor.getEditor();
					editor && ctx.hook.triggerHook("RESTORE_DEFAULT_DOCUMENT", editor);
				},
			},
		];

		ctx.hook.registerHook("MONACO_MARKDOWN_READY", function (e) {
			formatList.forEach((item) => {
				ctx.editor.registerSingleAction(e.editor, {
					...item,
					keybindings: ctx.editor.getKeysbinding(item.keybindings!),
				});

				ctx.commnad.registerCommand({
					id: item.id,
					title: item.label,
					keybindLabel: ctx.editor.getKeysLabel(item.keybindings!, "|").split("|"),
					keybinding: ctx.editor.getKeysbinding(item.keybindings!),
					handle: <CommandPalette["handle"]>(<unknown>item.run),
				});
			});

			insertList.forEach((item) => {
				ctx.editor.registerSingleAction(e.editor, {
					...item,
					keybindings: ctx.editor.getKeysbinding(item.keybindings!),
				});

				ctx.commnad.registerCommand({
					id: item.id,
					title: item.label,
					keybindLabel: ctx.editor.getKeysLabel(item.keybindings!, "|").split("|"),
					keybinding: ctx.editor.getKeysbinding(item.keybindings!),
					handle: <CommandPalette["handle"]>(<unknown>item.run),
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
				...insertList.map<StatusMenuItem>((item, index) => {
					return {
						id: `plugin.editor.markdown.${index}`,
						type: "normal",
						title: item.label,
						subTitle: ctx.editor.getKeysLabel(item.keybindings!),
						onClick: () => item.run(ctx.editor.getEditor()!),
					};
				}),
				{ type: "separator" },
				...markdown.map<StatusMenuItem>((item, index) => {
					return {
						id: `plugin.editor.markdown.${index}`,
						type: "normal",
						title: item.label,
						onClick() {
							const editor = ctx.editor.getEditor();
							editor && ctx.editor.tools.insert(editor, item.value);
						},
					};
				})
			);
		});
	},
};
