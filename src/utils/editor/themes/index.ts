import { themmStore } from "@/store";
import * as monaco from "monaco-editor";

import themelist from "./themelist.json";
const importModules = import.meta.glob("./*.json");
const keys = Object.keys(importModules);

// 执行批量替换操作
for (const path of keys) {
	// 裁剪字符串方式得到路径中的文件名（无扩展名）
	const name = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".json"));
	// 对原对象执行添加新的属性并删除旧属性达到处理效果
	importModules[name] = importModules[path];
	delete importModules[path];
}

export const themes = ((list) => {
	const themes = [];
	for (const key in list) {
		if (Object.prototype.hasOwnProperty.call(list, key)) {
			themes.push({
				label: list[key as keyof typeof list],
				value: key,
			});
		}
	}
	return themes;
})(themelist);

export const switchTheme = (key: string) => {
	const element = themelist[key as keyof typeof themelist];
	if (importModules[element]) {
		importModules[element]().then((res) => {
			monaco.editor.defineTheme(key, res as monaco.editor.IStandaloneThemeData);
			monaco.editor.setTheme(key);
			themmStore.editorTheme = key;
		});
	}
};

console.log(switchTheme);
