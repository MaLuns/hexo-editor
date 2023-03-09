import type { Plugin } from "@/core/plugin";
import type { MenuItem } from "@/core/status-bar";
import { formatDate } from "@/utils";
import markdown from "@/assets/markdown.json";

export default <Plugin>{
	name: "editor-md",
	register(ctx) {
		const list = [
			{
				title: "插入当前日期",
				run() {
					const editor = ctx.editor.getEditor();
					editor && ctx.editor.tools.insert(editor, formatDate(new Date(), "hh:mm:ss"));
				},
			},
			{
				title: "插入当前时间",
				run() {
					const editor = ctx.editor.getEditor();
					editor && ctx.editor.tools.insert(editor, formatDate(new Date(), "YYYY-MM-DD"));
				},
			},
			{
				title: "插入当前时间",
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
				contextMenuGroupId: "format",
				contextMenuOrder: 1,
				run(editor) {
					editor.getAction("editor.action.formatDocument")?.run();
				},
			});

			list.forEach((item, index) => {
				ctx.editor.registerSingleAction(e.editor, {
					id: `plugin.editor.insert-date-tiem.${index}`,
					label: item.title,
					contextMenuGroupId: "modification",
					contextMenuOrder: 1,
					run: item.run,
				});
			});

			markdown.forEach((item, index) => {
				ctx.editor.registerSingleAction(e.editor, {
					id: `plugin.editor.markdown.${index}`,
					label: item.label,
					contextMenuGroupId: "markdown",
					contextMenuOrder: index,
					run(editor) {
						ctx.editor.tools.insert(editor, item.syntax ? item.syntax : item.value, Boolean(item.syntax));
					},
				});
			});
		});

		ctx.statusBar.tapMenus((menus) => {
			menus["status-bar-insert"]?.list?.push(
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
				}),
				{
					type: "separator",
				},
				...list.map((item, index) => {
					return {
						id: `plugin.editor.markdown.${index}`,
						type: "normal",
						title: item.title,
						onClick() {
							item.run();
						},
					} as MenuItem;
				})
			);
		});
	},
};
