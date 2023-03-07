import { registerHook } from "@/core/hook";
import type { Plugin } from "@/core/plugin";
import type { Menus } from "@/core/statusBar";
import { strFormat } from "@/utils";

export default <Plugin>{
	name: "status-bar-document-info",
	register: (ctx) => {
		ctx.statusBar.tapMenus((menus: Menus) => {
			const str = "L {0}, C {1} ";
			const str2 = "总行数: {0} 字符数: {1}";
			const str3 = "已选择: {0},{1}";

			const title = ref(`${strFormat(str, 0, 0)}${strFormat(str2, 0, 0)}`);

			registerHook("MONACO_EDITOR_CURSOR_POSITION", function (e) {
				let newStr = strFormat(str, e.line, e.column);
				if (e.selectedLength > 0) {
					newStr += strFormat(str3, e.selectedLines, e.selectedLength);
				} else {
					newStr += strFormat(str2, e.lineCount, e.textLength);
				}
				title.value = newStr;
			});

			menus["status-bar-document-info"] = {
				id: "status-bar-document-info",
				position: "right",
				title: title,
				onClick() {
					/* ctx.editor.focus();
					ctx.editor.getAction("editor.action.gotoLine").run(); */
				},
			};
		});
	},
};
