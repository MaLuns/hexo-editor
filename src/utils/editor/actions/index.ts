import * as actions from "monaco-editor/esm/vs/platform/actions/common/actions";
import * as monaco from "monaco-editor";
import { formatDate } from "../..";
import { insert } from "../tool";

const KM = monaco.KeyMod;
const KC = monaco.KeyCode;
const insertTime = (editor: monaco.editor.ICodeEditor) => {
	insert(editor, formatDate(new Date(), "hh:mm:ss"));
};

const insertDate = (editor: monaco.editor.ICodeEditor) => {
	insert(editor, formatDate(new Date(), "YYYY-MM-DD"));
};

const revealLineInPreview = (editor: monaco.editor.ICodeEditor) => {
	const line = editor.getPosition()?.lineNumber;
	console.log(line);

	/* if (line && ctx.doc.isSameFile(ctx.view.getRenderEnv()?.file, ctx.store.state.currentFile)) {
		ctx.view.highlightLine(line, true, 1000);
	} */
};

const menuActions: { [k: string]: monaco.editor.IActionDescriptor } = {
	["insert-date"]: {
		id: "plugin.editor.insert-date",
		label: "插入当前日期",
		contextMenuGroupId: "modification",
		contextMenuOrder: 1,
		run: insertDate,
	},
	["insert-time"]: {
		id: "plugin.editor.insert-time",
		label: "插入当前时间",
		contextMenuGroupId: "modification",
		contextMenuOrder: 2,
		run: insertTime,
	},
	["reveal-line-in-preview"]: {
		id: "plugin.editor.reveal-line-in-preview",
		label: "在预览中聚焦",
		contextMenuGroupId: "other",
		run: revealLineInPreview,
	},
	themes: {
		id: "plugin.editor.switch-themes",
		label: "切换主题",
		contextMenuGroupId: "a",
		run: (editor: monaco.editor.IStandaloneCodeEditor) => {
			editor.getAction("dedede")?.run();
			editor.addCommand(KM.Alt, () => {});
		},
	},
};

monaco.editor.registerCommand("dedede", (a) => {
	console.log(a);
});

export const removeDefaultAction = () => {
	const menus = actions.MenuRegistry._menuItems as Map<any, any>;
	const contextMenuEntry = Array.from(menus, ([key, value]) => ({ key, value })).find((entry) => entry.key.id == "EditorContext");

	const removableIds: string[] = [
		"editor.action.clipboardCutAction",
		"editor.action.clipboardCopyAction",
		"editor.action.clipboardPasteAction",
		"editor.action.refactor",
		"editor.action.sourceAction",
		"editor.action.revealDefinition",
		"editor.action.revealDeclaration",
		"editor.action.goToTypeDefinition",
		"editor.action.goToImplementation",
		"editor.action.goToReferences",
		"editor.action.formatDocument",
		"editor.action.formatSelection",
		"editor.action.changeAll",
		"editor.action.rename",
		"editor.action.quickOutline",
		"editor.action.quickCommand",
		"Peek",
	];

	const removeById = (list: any, ids: string[]) => {
		let node = list._first;
		do {
			const shouldRemove = ids.includes(node.element?.command?.id);
			if (shouldRemove) {
				list._remove(node);
			}
		} while ((node = node.next));
	};

	removeById(contextMenuEntry?.value, removableIds);
};

export const singleActionInit = (editor: monaco.editor.IStandaloneCodeEditor, keys: Array<keyof typeof menuActions>) => {
	keys.forEach((key) => {
		menuActions[key] && editor.addAction(menuActions[key]);
	});
};

export const initAction = (keys: Array<keyof typeof menuActions>) => {
	keys.forEach((key) => {
		menuActions[key] && monaco.editor.addEditorAction(menuActions[key]);
	});
};
