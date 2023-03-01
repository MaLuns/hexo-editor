import { fileStore } from "@/store";
import * as monaco from "monaco-editor";

/**
 * Insert text at current cursor.
 * @param editor
 * @param text
 */
export const insert = (editor: monaco.editor.ICodeEditor, text: string) => {
	const selection = editor.getSelection()!;
	editor.executeEdits("", [
		{
			range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
			text,
			forceMoveMarkers: true,
		},
	]);
	editor.focus();
};

/**
 * Insert text at position.
 * @param editor
 * @param position
 * @param text
 */
export const insertAt = (editor: monaco.editor.ICodeEditor, position: monaco.Position, text: string) => {
	editor.executeEdits("", [
		{
			range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
			text,
			forceMoveMarkers: true,
		},
	]);
	editor.setPosition(position);
	editor.focus();
};

/**
 * Replace text value of line.
 * @param editor
 * @param line
 * @param text
 */
export const replaceLine = (editor: monaco.editor.ICodeEditor, line: number, text: string) => {
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
};

const paste = async (e: ClipboardEvent, editor: monaco.editor.ICodeEditor) => {
	if (!editor.hasTextFocus() && !fileStore.post) {
		return;
	}
	const items = e.clipboardData!.items;
	for (let i = 0; i < items.length; i++) {
		const fileType = items[i].type;
		if (fileType.indexOf("image") !== -1) {
			e.preventDefault();
			e.stopPropagation();

			const assetPath = await fileStore.fs?.uploadImage(items[i].getAsFile()!, fileStore.post!.path);

			insert(editor, `![Img](${assetPath})\n`);
		}
	}
};

/**
 * 图片粘贴
 * @param editor
 */
export const regPaste = (editor: monaco.editor.ICodeEditor) => {
	console.log(editor.getContainerDomNode());

	editor.getContainerDomNode().addEventListener("paste", (e) => paste(e, editor), true);
};
