import { configStore } from "@/store";
import * as monaco from "monaco-editor";

const commands = {
	wordWrap: {
		keybinding: monaco.KeyMod.Alt | monaco.KeyCode.KeyZ,
		handler: function () {
			configStore.editorOption.wordWrap = configStore.editorOption.wordWrap === "off" ? "on" : "off";
		},
	},
	mouseWheelZoom: {
		keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyZ,
		handler: function () {
			configStore.editorOption.mouseWheelZoom = !configStore.editorOption.mouseWheelZoom;
		},
	},
} as {
	[k: string]: {
		keybinding: number;
		handler: monaco.editor.ICommandHandler;
	};
};

export const singleCommandInit = (editor: monaco.editor.IStandaloneCodeEditor, keys: Array<keyof typeof commands>) => {
	keys.forEach((key) => {
		const command = commands[key];
		if (command) {
			editor.addCommand(command.keybinding, command.handler);
		}
	});
};

export const initCommand = (keys: Array<keyof typeof commands>) => {
	keys.forEach((key) => {
		const command = commands[key];
		if (command) {
			monaco.editor.addCommand({
				id: key as string,
				run: command.handler,
			});
		}
	});
};
