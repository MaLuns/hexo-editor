import * as monaco from "monaco-editor";
import * as actions from "monaco-editor/esm/vs/platform/actions/common/actions";
import { language as markdown, conf as markdownConfig } from "monaco-editor/esm/vs/basic-languages/markdown/markdown";
import { language as yaml, conf as yamlConf } from "monaco-editor/esm/vs/basic-languages/yaml/yaml";
import { registerHook } from "./hook";
import { isMacOS, strFormat } from "@/utils";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "json") {
			return new jsonWorker();
		}
		if (label === "css" || label === "scss" || label === "less") {
			return new cssWorker();
		}
		if (label === "html" || label === "handlebars" || label === "razor") {
			return new htmlWorker();
		}
		if (label === "typescript" || label === "javascript") {
			return new tsWorker();
		}
		return new editorWorker();
	},
};

/* import metadata from "monaco-editor/esm/metadata";
const prefix = "monaco-editor/esm/";
const autoImport = metadata.features.map((feat) => {
	let entry = Object.prototype.toString.call(feat.entry) === "[object String]" ? [feat.entry as string] : (feat.entry as string[]);
	entry = entry.map((val) => `import '${prefix}${val}'`);
	return `// ${feat.label}
${entry.join("\n")}`;
});
console.log(autoImport.join("\n")); */

monaco.languages.register({ id: "md" });
monaco.languages.setMonarchTokensProvider("md", markdown);
monaco.languages.setLanguageConfiguration("md", markdownConfig);

monaco.languages.register({ id: "yml" });
monaco.languages.setMonarchTokensProvider("yml", yaml);
monaco.languages.setLanguageConfiguration("yml", yamlConf);

export type SimpleCompletionItem = {
	label: string;
	desc?: string;
	kind?: monaco.languages.CompletionItemKind;
	insertText: string;
};

export type Command = {
	keybinding: number;
	handler: monaco.editor.ICommandHandler;
};

const mdSimpleCompletionItem: SimpleCompletionItem[] = [
	{ label: "/ ![]() Image", insertText: "![${2:Img}]($1)", desc: "图片" },
	{ label: "/ []() Link", insertText: "[${2:Link}]($1)", desc: "链接" },
	{ label: "/ # Head 1", insertText: "# $1", desc: "一级标题" },
	{ label: "/ ## Head 2", insertText: "## $1", desc: "二级标题" },
	{ label: "/ ### Head 3", insertText: "### $1", desc: "三级标题" },
	{ label: "/ #### Head 4", insertText: "#### $1", desc: "四级标题" },
	{ label: "/ ##### Head 5", insertText: "##### $1", desc: "五级标题" },
	{ label: "/ ###### Head 6", insertText: "###### $1", desc: "六级标题" },
	{ label: "/ + List", insertText: "+ ", desc: "列表" },
	{ label: "/ - List", insertText: "- ", desc: "列表" },
	{ label: "/ ` Code", insertText: "`$1`", desc: "行内代码" },
	{ label: "/ * Italic", insertText: "*$1*", desc: "斜体" },
	{ label: "/ _ Italic", insertText: "_$1_", desc: "斜体" },
	{ label: "/ ~ Sub", insertText: "~$1~", desc: "副标题" },
	{ label: "/ ^ Sup", insertText: "^$1^", desc: "副标题" },
	{ label: "/ ** Bold", insertText: "**$1**", desc: "加粗" },
	{ label: "/ __ Bold", insertText: "__$1__", desc: "加粗" },
	{ label: "/ ~~ Delete", insertText: "~~$1~~", desc: "删除线" },
	{ label: "/ == Mark", insertText: "==$1==", desc: "标记" },
	{ label: "/ ``` Fence", insertText: "```$1\n```\n", desc: "代码块" },
	{ label: "/ ||| Table", insertText: "| ${1:TH} | ${2:TH} | ${3:TH} |\n| -- | -- | -- |\n| TD | TD | TD |", desc: "表格" },
	{ label: "/ ||| Small Table", insertText: "| ${1:TH} | ${2:TH} | ${3:TH} |\n| -- | -- | -- |\n| TD | TD | TD |\n{.small}", desc: "表格" },
	{ label: "/ --- Horizontal Line", insertText: "\n---\n", desc: "分割线" },
	{ label: "/ + [ ] TODO List", insertText: "+ [ ] ", desc: "完成事项" },
	{ label: "/ - [ ] TODO List", insertText: "- [ ] ", desc: "完成事项" },
];

monaco.languages.registerCompletionItemProvider("md", {
	provideCompletionItems(model, position) {
		const line = model.getLineContent(position.lineNumber);
		const cursor = position.column - 1;
		const linePrefixText = line.slice(0, cursor);
		let startColumn = linePrefixText.lastIndexOf(" ") + 2;
		if (startColumn === position.column) {
			startColumn = 0;
		}

		const range = new monaco.Range(position.lineNumber, startColumn, position.lineNumber, position.column);

		return {
			suggestions: mdSimpleCompletionItem.map((item, i) => {
				return {
					label: {
						label: item.label,
						description: item.desc,
					},
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText: item.insertText,
					insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					range,
					sortText: i.toString().padStart(7),
				};
			}),
		};
	},
	triggerCharacters: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~".split(""),
});

const components = {
	scheme: "web-hexo-editor",
};

// 屏蔽默认快捷键
monaco.editor.addKeybindingRules([
	{
		keybinding: monaco.KeyCode.F1,
		command: null,
	},
]);

// 当前页面编辑器
let editor: monaco.editor.IStandaloneCodeEditor | null;
registerHook("MONACO_ACTIVATE", function (e) {
	editor = e;
});

/**
 * 获取 monaco
 * @returns
 */
export const getMonaco = () => monaco;
/**
 * 获取当前页面中编辑器（暂不支持多个）
 * @returns
 */
export const getEditor = () => editor;

/**
 * 快捷键
 */
export const KCM = {
	code: monaco.KeyCode,
	mod: monaco.KeyMod,
};

/**
 * Editor 编辑器操作方法
 */
export const tools = {
	/**
	 *  生成 Uri
	 * @param path
	 * @returns
	 */
	uri(path: string) {
		return monaco.Uri.from({
			...components,
			path,
		});
	},
	/**
	 * Insert text at position.
	 * @param editor
	 * @param position
	 * @param text
	 */
	insertAt(editor: monaco.editor.ICodeEditor, position: monaco.Position, text: string) {
		editor.executeEdits("", [
			{
				range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
				text,
				forceMoveMarkers: true,
			},
		]);
		editor.setPosition(position);
		editor.focus();
	},
	/**
	 * 插入文本
	 * @param editor
	 * @param text
	 * @param bool 是否覆盖 选择文本
	 */
	insert(editor: monaco.editor.ICodeEditor, text: string, bool = false) {
		const selection = editor.getSelection()!;
		const selectionText = editor.getModel()?.getValueInRange(selection);
		let range = new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn);
		if (bool) {
			range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
			console.log(text, selectionText);
			text = strFormat(text, selectionText);
		}
		editor.executeEdits("", [
			{
				range,
				text,
				forceMoveMarkers: true,
			},
		]);
		editor.focus();
	},
	/**
	 * Replace text value of line.
	 * @param editor
	 * @param line
	 * @param text
	 */
	replaceLine(editor: monaco.editor.ICodeEditor, line: number, text: string) {
		const length = editor.getModel()!.getLineLength(line);
		editor.executeEdits("", [
			{
				range: new monaco.Range(line, 1, line, length + 1),
				text,
				forceMoveMarkers: true,
			},
		]);
		editor.setPosition(new monaco.Position(line, text.length + 1));
		editor.focus();
	},
};

/**
 * 增加 Markdown 语法提示
 * @param items
 * @returns
 */
export const addSimpleCompletionItem = (items: SimpleCompletionItem[]) => mdSimpleCompletionItem.unshift(...items);

/**
 * 注册编辑器 Command
 * @param editor
 * @param command
 */
export const registerSingleCommand = (editor: monaco.editor.IStandaloneCodeEditor, command: Command) => {
	editor.addCommand(command.keybinding, command.handler);
};

export const registerCommand = () => {};

/**
 * 注册编辑器 Action
 * @param editor
 * @param action
 */
export const registerSingleAction = (editor: monaco.editor.IStandaloneCodeEditor, action: monaco.editor.IActionDescriptor) => {
	editor.addAction(action);
};

/**
 * 注册全局 Action
 * @param action
 */
export const registerAction = (action: monaco.editor.IActionDescriptor) => {
	monaco.editor.addEditorAction(action);
};

/**
 * 移除默认 Action
 */
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

const getKeyLabel = (num: number) => {
	const key = monaco.KeyCode[num];
	if (key) return key.replace(/Key|Numpad|Digit/, "");
	if (num === monaco.KeyMod.CtrlCmd) {
		return isMacOS ? "⌘" : "Ctrl";
	} else if (num === monaco.KeyMod.Shift) {
		return isMacOS ? "⇧" : "Shift";
	} else if (num === monaco.KeyMod.Alt) {
		return isMacOS ? "⌥" : "Alt";
	} else if (num === monaco.KeyMod.WinCtrl) {
		return isMacOS ? "\u2303" : "Ctrl";
	}
	return num.toString();
};

/**
 * 获取 KeyCode Label
 * @param numbers
 * @param separator
 * @returns
 */
export const getKeysLabel = (numbers: number[], separator?: string) => {
	separator = separator || "+";
	const labels = [];
	const k: string[] = [];
	numbers.forEach((num) => {
		if (Array.isArray(num)) {
			labels.push(getKeysLabel(num, separator));
		} else {
			k.push(getKeyLabel(num));
		}
	});
	if (k.length) labels.push(k.join(separator));

	return labels.join(" | ");
};

/**
 * 转换为快捷键
 * @param numbers
 */
export const getKeysbinding = (numbers: number[]) => {
	const keys: number[] = [];
	let _num: number | undefined = undefined;
	numbers.forEach((num) => {
		if (Array.isArray(num)) {
			keys.push(...getKeysbinding(num));
		} else {
			if (_num === undefined) _num = num;
			else _num = _num | num;
		}
	});
	if (_num !== undefined) keys.push(_num);
	return keys;
};

removeDefaultAction();
