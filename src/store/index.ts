import type AbstractFileSystem from "@/utils/fs/core/AbstractFileSystem";
import { darkTheme } from "naive-ui";
import { deepMerge } from "@/utils";
import storage from "@/utils/storage";

import themes from "@/themes";

const defConfig: GlobalConfig = {
	layout: {
		layoutSiderWidth: "54px",
		layoutFooterBar: "22px",
		editorAsideWidth: "280px",
		isShowLayoutSider: true,
	},
	theme: "light",
	language: "zh_cn",
	preStyle: "",
	editorLightTheme: "vs",
	editorDartTheme: "vs-dark",
	lineNumbers: "off",
	autoSave: 0,
	autoRender: 2000,
	fontSize: 14,
	fontFamily: undefined,
	minimap: true,
	imgStorageDir: "source/images/",
	pictureBed: "",
};

export const fileStore = reactive({
	fs: <AbstractFileSystem | null>null,
	post: <PostModel | null>null,
	setFileSystem(fs: AbstractFileSystem) {
		this.fs = fs;
	},
});

// 全局配置
export const configStore = reactive(<GlobalConfig>deepMerge(defConfig, storage.getItem("config", {})));

export const themeMode = computed(() => {
	if (configStore.theme === "system") {
		return window.matchMedia("(prefers-color-scheme: light)").matches ? null : darkTheme;
	}
	return configStore.theme === "light" ? null : darkTheme;
});

export const editorTheme = computed(() => {
	if (configStore.theme === "system") {
		return window.matchMedia("(prefers-color-scheme: light)").matches ? configStore.editorLightTheme : configStore.editorDartTheme;
	}
	return configStore.theme === "light" ? configStore.editorLightTheme : configStore.editorDartTheme;
});

export const themeColors = computed(() => (themeMode.value ? themes[1] : themes[0]));

watch(
	() => configStore,
	(val) => {
		storage.setItem("config", val);
	},
	{ deep: true }
);
