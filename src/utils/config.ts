import { loadEditorTheme, themes } from "@/plugins/editor-themes";
import { configStore } from "@/store";

export const styleConfig: FromConfig[] = [
	{
		title: "主题",
		key: "theme",
		isCommand: true,
		type: "select",
		attr: {
			class: "w-100",
			options: [
				{ label: "亮白", value: "light" },
				{ label: "暗黑", value: "dark" },
				{ label: "跟随系统", value: "system" },
			],
			value: computed(() => configStore.theme),
			"on-update:value": (e: GlobalConfig["theme"]) => (configStore.theme = e),
		},
	},
	{
		title: "语言",
		key: "language",
		isCommand: true,
		type: "select",
		attr: {
			class: "w-100",
			options: [
				{ label: "中文", value: "zh_cn" },
				{ label: "English", value: "en" },
			],
			value: computed(() => configStore.language),
			"on-update:value": (e: GlobalConfig["language"]) => (configStore.language = e),
		},
	},
	{
		title: "编辑器主题(亮)",
		key: "editorLightTheme",
		type: "select",
		isCommand: true,
		attr: {
			class: "w-200",
			options: themes[0],
			value: computed(() => configStore.editorLightTheme),
			"on-update:value": (e: string) => {
				loadEditorTheme("light", e);
				configStore.editorLightTheme = e;
			},
		},
	},
	{
		title: "编辑器主题(暗)",
		key: "editorDartTheme",
		type: "select",
		isCommand: true,
		attr: {
			class: "w-200",
			options: themes[1],
			value: computed(() => configStore.editorDartTheme),
			"on-update:value": (e: string) => {
				loadEditorTheme("dark", e);
				configStore.editorDartTheme = e;
			},
		},
	},
	{
		title: "预览样式",
		key: "preStyle",
		type: "input",
		attr: {
			placeholder: "自定义预览标签，配合自定义样式使用",
			type: "textarea",
			value: computed(() => configStore.preStyle),
			"on-update:value": (e: string) => (configStore.preStyle = e),
		},
	},
	{
		title: "预览标签",
		key: "preTag",
		type: "input",
		attr: {
			placeholder: "自定义预览标签，配合自定义样式使用",
			value: computed(() => configStore.preTag),
			"on-update:value": (e: string) => (configStore.preTag = e),
		},
	},
	{
		title: "预览标签类",
		key: "preClass",
		type: "input",
		attr: {
			placeholder: "自定义预览标签样式类，配合自定义样式使用",
			value: computed(() => configStore.preClass),
			"on-update:value": (e: string) => (configStore.preClass = e),
		},
	},
];

export const editorConfig: FromConfig[] = [
	{
		title: "行号",
		key: "editorOption.lineNumbers",
		type: "select",
		attr: {
			class: "w-100",
			options: [
				{ label: "On", value: "on" },
				{ label: "Off", value: "off" },
				{ label: "Relative", value: "relative" },
				{ label: "Interval", value: "interval" },
			],
			value: computed(() => configStore.editorOption.lineNumbers),
			"on-update:value": (e: GlobalConfig["editorOption"]["lineNumbers"]) => (configStore.editorOption.lineNumbers = e),
		},
	},
	{
		title: "自动保存",
		key: "autoSave",
		type: "select",
		attr: {
			class: "w-100",
			options: [
				{ label: "关闭", value: 0 },
				{ label: "1s", value: 1000 },
				{ label: "2s", value: 2000 },
				{ label: "4s", value: 4000 },
				{ label: "8s", value: 8000 },
				{ label: "30s", value: 30000 },
				{ label: "60s", value: 60000 },
			],
			value: computed(() => configStore.autoSave),
			"on-update:value": (e: number) => (configStore.autoSave = e),
		},
	},
	{
		title: "自动渲染",
		key: "autoRender",
		type: "select",
		attr: {
			class: "w-100",
			options: [
				{ label: "关闭", value: 0 },
				{ label: "0.2s", value: 200 },
				{ label: "0.5s", value: 500 },
				{ label: "0.7s", value: 700 },
				{ label: "1s", value: 1000 },
				{ label: "1.5s", value: 1500 },
				{ label: "2s", value: 2000 },
			],
			value: computed(() => configStore.autoRender),
			"on-update:value": (e: number) => (configStore.autoRender = e),
		},
	},
	{
		title: "显示小地图",
		key: "editorOption.minimap.enabled",
		type: "switch",
		attr: {
			value: computed(() => configStore.editorOption.minimap.enabled),
			"on-update:value": (e: boolean) => (configStore.editorOption.minimap.enabled = e),
		},
	},
	{
		title: "小地图样式",
		key: "editorOption.minimap.renderCharacters",
		type: "switch",
		attr: {
			label: "显示文字",
			unlabel: "显示块",
			value: computed(() => configStore.editorOption.minimap.renderCharacters),
			"on-update:value": (e: boolean) => (configStore.editorOption.minimap.renderCharacters = e),
		},
	},
	{
		title: "换行显示",
		key: "editorOption.wordWrap",
		type: "select",
		attr: {
			class: "w-180",
			options: [
				{ label: "On", value: "on" },
				{ label: "Off", value: "off" },
				{ label: "WordWrapColumn", value: "wordWrapColumn" },
				{ label: "Bounded", value: "bounded" },
			],
			value: computed(() => configStore.editorOption.wordWrap),
			"on-update:value": (e: GlobalConfig["editorOption"]["wordWrap"]) => (configStore.editorOption.wordWrap = e),
		},
	},
	{
		title: "鼠标滚轮缩放",
		key: "editorOption.mouseWheelZoom",
		type: "switch",
		attr: {
			value: computed(() => configStore.editorOption.mouseWheelZoom),
			"on-update:value": (e: boolean) => (configStore.editorOption.mouseWheelZoom = e),
		},
	},
	{
		title: "字体大小",
		key: "editorOption.fontSize",
		type: "slider",
		attr: {
			step: 2,
			max: 20,
			min: 12,
		},
	},
	{
		title: "字体",
		key: "editorOption.fontFamily",
		type: "input",
		attr: {
			placeholder: "e.g., 'Courier New', monospace",
			value: computed(() => configStore.editorOption.fontFamily),
			"on-update:value": (e: string) => (configStore.editorOption.fontFamily = e),
		},
	},
];

export const otherConfig: FromConfig[] = [
	{
		title: "Front-Matter",
		key: "hideFrontMatter",
		type: "switch",
		attr: {
			label: "隐藏 Front-Matter",
			unlabel: "显示 Front-Matter",
			value: computed(() => configStore.hideFrontMatter),
			"on-update:value": (e: boolean) => (configStore.hideFrontMatter = e),
		},
	},
	{
		title: "图片存储方式",
		key: "imgStorageType",
		type: "select",
		attr: {
			class: "w-100",
			options: [{ label: "本地", value: "Local" }],
			value: computed(() => configStore.imgStorageType),
			"on-update:value": (e: GlobalConfig["imgStorageType"]) => (configStore.imgStorageType = e),
		},
	},
	{
		title: "图片存放目录",
		key: "imgStorageDir",
		type: "input",
		attr: {
			placeholder: "e.g., 'Courier New', monospace",
			value: computed(() => configStore.imgStorageDir),
			"on-update:value": (e: string) => (configStore.imgStorageDir = e),
		},
	},
];
