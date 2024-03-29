import type AbstractFileSystem from "@/core/file-system/abstract-file-system";
import { darkTheme } from "naive-ui";
import { deepMerge } from "@/utils";
import { getMonaco } from "@/core/editor";
import storage from "@/utils/storage";
import themes from "@/themes";
import { loadEditorTheme } from "@/plugins/editor-themes";
import defConfig from "./config";

const monaco = getMonaco();

/**
 * FileSystem
 */
export const fileStore = reactive({
	fs: <AbstractFileSystem | null>null,
	post: <PostModel | null>null,
	tocs: <TocNode[]>[],
	setFileSystem(fs: AbstractFileSystem) {
		this.fs = fs;
	},
});

/**
 * 全局配置
 */
export const configStore = reactive(<GlobalConfig>deepMerge(defConfig, storage.getItem("config", {})));

/**
 * Naive UI 主题类型
 */
export const themeMode = computed(() => {
	if (configStore.theme === "system") return window.matchMedia("(prefers-color-scheme: light)").matches ? null : darkTheme;
	return configStore.theme === "light" ? null : darkTheme;
});

/**
 * 编辑器主题
 */
export const editorTheme = computed(() => {
	if (configStore.theme === "system") return window.matchMedia("(prefers-color-scheme: light)").matches ? configStore.editorLightTheme : configStore.editorDartTheme;
	return configStore.theme === "light" ? configStore.editorLightTheme : configStore.editorDartTheme;
});

/**
 * 自定义主题颜色
 */
export const themeColors = computed(() => (themeMode.value ? themes[1] : themes[0]));

watch(
	() => configStore,
	(val) => storage.setItem("config", val),
	{ deep: true }
);

watch(
	() => editorTheme.value,
	(val) => loadEditorTheme(themeMode.value ? "dark" : "light", val),
	{ immediate: true }
);

watch(
	() => configStore.editorOption,
	(val) => {
		const edits = monaco.editor.getEditors();
		edits.forEach((item) => item.updateOptions(val));
	},
	{ deep: true }
);
