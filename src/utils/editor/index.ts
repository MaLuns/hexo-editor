import * as monaco from "monaco-editor";
import { language as markdown, conf as markdownConfig } from "monaco-editor/esm/vs/basic-languages/markdown/markdown";
import { language as yaml, conf as yamlConf } from "monaco-editor/esm/vs/basic-languages/yaml/yaml";

monaco.languages.register({ id: "md" });
monaco.languages.setMonarchTokensProvider("md", markdown);
monaco.languages.setLanguageConfiguration("md", markdownConfig);

monaco.languages.register({ id: "yml" });
monaco.languages.setMonarchTokensProvider("yml", yaml);
monaco.languages.setLanguageConfiguration("yml", yamlConf);

const importModules = import.meta.glob("./themes/*.json");
import themelist from "./themes/themelist.json";

const keys = Object.keys(importModules);
// 执行批量替换操作
for (const path of keys) {
	// 裁剪字符串方式得到路径中的文件名（无扩展名）
	const name = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".json"));
	// 对原对象执行添加新的属性并删除旧属性达到处理效果
	importModules[name] = importModules[path];
	delete importModules[path];
}

export const switchTheme = (key: string) => {
	const element = themelist[key as keyof typeof themelist];
	if (importModules[element]) {
		importModules[element]().then((res) => {
			monaco.editor.defineTheme(key, res as monaco.editor.IStandaloneThemeData);
			monaco.editor.setTheme(key);
		});
	}
};
