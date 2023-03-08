declare interface FileStoreModel {
	id?: string;
	name: string;
	type: FileStoreTypeEnum;
	value: FileStoreModel.type extends "Local" ? FileSystemDirectoryHandle : string;
}

declare type LabelVal = {
	label: string;
	value: any;
};

declare type HookTypes = {
	MONACO_READY: { editor: Monaco.editor.IStandaloneCodeEditor; monaco: typeof Monaco };
	MONACO_EDITOR_CURSOR_POSITION: {
		line: number;
		column: number;
		lineCount: number;
		textLength: number;
		selectedLength: number;
		selectedLines: number;
		selectionCount: number;
	};
	MARKDOWN_RENDER_BEFORE: string;
	MARKDOWN_RENDER_AFTER: { text: string; html: string };
	TOC_LIST_CLICK: TocNode;
};

declare interface LayoutConfig {
	layoutSiderWidth: string;
	layoutFooterBar: string;
	editorAsideWidth: string;
	isShowLayoutSider: boolean;
	isShowLayoutEditorAside: boolean;
	isShowMarkdownEditor: boolean;
	isShowMarkdownPrew: boolean;
}

declare interface EditorOptions {
	// 行号
	lineNumbers: "on" | "off" | "relative" | "interval";
	// 字体大小
	fontSize: number;
	// 字体样式
	fontFamily: string | undefined;
	// minimap
	minimap: {
		enabled: boolean;
		renderCharacters: boolean;
	};
	// 换行
	wordWrap: "off" | "on" | "wordWrapColumn" | "bounded";
	// 滚轮缩放
	mouseWheelZoom: boolean;
}

declare interface GlobalConfig {
	layout: LayoutConfig;
	// 主题
	theme: "light" | "dark" | "system";
	// 语言
	language: "zh_cn" | "en";
	// 预览样式
	preStyle: string;
	// 编辑器样式
	editorLightTheme: string;
	// 编辑器样式
	editorDartTheme: string;
	// 编辑器配置
	editorOption: EditorOptions;
	// 自动保存
	autoSave: number;
	// 自动渲染
	autoRender: number;
	// 隐藏 Front-Matter
	hideFrontMatter: boolean;
	// 上传图片存放地址
	imgStorageDir: string;
	// 图床
	pictureBed: string;
}

// 主题颜色变量
declare interface ThemeVars {
	sider: {
		bgColor: string;
		iconColor: string;
		iconActiveColor: string;
	};
	post: {
		tabs: {
			tabBgColor: string;
			tabColor: string;
			panBgColor: string;
			suffixBgColor: string;
		};
		aside: {
			borderColor: string;
			header: {
				bgColor: string;
			};
			list: {
				titleBgColor: string;
				titleColot: string;
				activeBgColor: string;
			};
		};
	};
	footer: {
		bgColor: string;
		color: string;
	};
}

// TOC
declare interface TocNode {
	id: string;
	level: number;
	text: string;
	children: TocNode[];
}
