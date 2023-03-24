import { StandardKeyboardEvent } from "monaco-editor/esm/vs/base/browser/keyboardEvent";
import type { IKeyboardEvent } from "monaco-editor/esm/vs/editor/editor.api";

const commands: CommandPalette[] = [];

/**
 *  注册命令到命令面板
 * @param cp
 * @param insert
 */
export const registerCommand = (cp: CommandPalette, insert?: boolean) => {
	const index = commands.findIndex((item) => item.id === cp.id);
	if (index > -1) {
		commands.splice(index, 1, cp);
	} else {
		insert ? commands.unshift(cp) : commands.push(cp);
	}

	cp.keybinding;
};

/**
 * 移除命令
 * @param id 命令id
 */
export const removeCommand = (id: string) => {
	const index = commands.findIndex((item) => item.id === id);
	if (index > -1) {
		commands.splice(index, 1);
	}
};

/**
 * 获取以注册命令
 * @param id 命令ID
 * @returns
 */
export const getCommand = (id: string) => {
	return commands.find((item) => item.id === id);
};

/**
 * 获取已注册命令
 * @returns
 */
export const getCommands = () => {
	return commands;
};

/**
 * 执行命令
 * @param e
 * @returns
 */
const run = (e: IKeyboardEvent): boolean => {
	const command = commands.find((itme) => {
		if (itme.keybinding) {
			return itme.keybinding.some((key) => e.equals(key));
		}
		return false;
	});
	if (command) {
		command.handle && command.handle(command);
		return true;
	}
	return false;
};

/**
 * 绑定快捷键
 */
export const keydownEvent = (e: KeyboardEvent) => {
	const keyEvent = new StandardKeyboardEvent(e) as IKeyboardEvent;

	if (run(keyEvent)) {
		keyEvent.preventDefault();
		keyEvent.stopPropagation();
	}
};

window.addEventListener("keydown", function (e: KeyboardEvent) {
	const keyEvent = new StandardKeyboardEvent(e) as IKeyboardEvent;

	if (run(keyEvent)) {
		keyEvent.preventDefault();
		keyEvent.stopPropagation();
	}
});
