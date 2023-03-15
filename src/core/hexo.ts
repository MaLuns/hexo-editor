import { HexoFileType } from "@/enums";
import { formatDate } from "@/utils";
import fm from "@/utils/front-matter";
import yaml from "js-yaml";

let count = 0;

/**
 * Yaml DumpOptions
 */
const yamlDumpOpt = {
	lineWidth: 2000,
	styles: {
		"!!bool": "lowercase",
		"!!null": "empty",
	},
	prefixSeparator: true,
};

/**
 * 转换 md 中 Front-matter
 * @param text
 * @returns
 */
export const parseMd = (text: string) => {
	const fmData = fm.parse(text);

	// 转为数组结构
	["categories", "tags"].forEach((key) => {
		fmData[key] = fmData[key] || [];
		if (!Array.isArray(fmData[key])) {
			fmData[key] = [fmData[key]];
		}
	});

	return fmData;
};

/**
 * 将 Front-matter 转为文本
 * @param obj
 * @returns
 */
export const stringifyMd = (obj: any) => fm.stringify(obj, yamlDumpOpt);

/**
 * 转换 yaml
 * @param text
 * @returns
 */
export const parseYaml = (text: string) => yaml.load(text) as YamlConfig;

/**
 * 获取 source 目录
 * @param source
 * @param path
 * @returns
 */
export const getSourcePath = (source?: string, path?: string) => {
	source = source || "source";
	if (path) source += path;
	return source;
};

/**
 * 获取文件路径
 * @param name 文件名
 * @param type 页面类型 文章、草稿、页面
 * @param sourcePath hexo 配置 source 目录
 * @returns
 */
export const getFullPath = (name: string, type: HexoFileType, sourcePath?: string): string => {
	let path = (sourcePath || "source") + "/";
	switch (type) {
		case HexoFileType.post:
			path += `_posts/${name}${name.endsWith(".md") ? "" : ".md"}`;
			break;
		case HexoFileType.draft:
			path += `_drafts/${name}${name.endsWith(".md") ? "" : ".md"}`;
			break;
		case HexoFileType.page:
			path += name + "/";
			break;
	}
	return path;
};

/**
 * 生成图片名称
 * @returns
 */
export const getImageName = () => `img_${formatDate(new Date(), "YYYYMMDDhhmmss")}_${++count}`;
