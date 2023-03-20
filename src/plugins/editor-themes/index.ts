import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import themelist from "./themes/themelist.json";

const catchs: { [k: string]: boolean } = {
	vs: true,
	"vs-dark": true,
};

export const themes = ((list) => {
	const convert = (l: any) => {
		const theme = [];
		for (const key in l) {
			if (Object.prototype.hasOwnProperty.call(l, key)) {
				theme.push({
					label: l[key as keyof typeof l],
					value: key,
				});
			}
		}
		return theme;
	};
	return [convert(list.light), convert(list.dark)];
})(themelist);

// 执行批量替换操作
const importModules = import.meta.glob("./themes/*.json");
const keys = Object.keys(importModules);
for (const path of keys) {
	// 裁剪字符串方式得到路径中的文件名（无扩展名）
	const name = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".json"));
	// 对原对象执行添加新的属性并删除旧属性达到处理效果
	importModules[name] = importModules[path];
	delete importModules[path];
}

export const loadEditorTheme = (key: "light" | "dark", theme: string) => {
	const element = themelist[key];
	const name = element[theme as keyof typeof element];
	if (importModules[name]) {
		if (catchs[theme]) {
			monaco.editor.setTheme(theme);
		} else {
			importModules[name]().then((res) => {
				catchs[theme] = true;
				monaco.editor.defineTheme(theme, res as monaco.editor.IStandaloneThemeData);
				monaco.editor.setTheme(theme);
			});
		}
	} else {
		if (["vs", "vs-dark"].includes(theme)) {
			monaco.editor.setTheme(theme);
		}
	}
};
