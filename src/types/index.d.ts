/* declare interface Post {
	frontmatter: string;
	attributes: {
		[x: string]: any;
	};
	body: string;
	bodyBegin: number;
	_body: string;
	fileName: string;
	_handle: FileSystemFileHandle;
	_raw: string;
} */

declare enum FileStoreTypeEnum {
	Local = 1,
	Github = 2,
	Gitee = 3,
}

declare interface FileStoreModel {
	id?: string;
	name: string;
	type: FileStoreTypeEnum;
	value: FileStoreModel.type extends "Local" ? FileSystemDirectoryHandle : string;
}

declare type HookTypes = {
	MONACO_READY: { editor: Monaco.editor.IStandaloneCodeEditor; monaco: typeof Monaco };
};

declare interface LayoutConfig {
	layoutSiderWidth: string;
	layoutFooterBar: string;
	editorAsideWidth: string;
	isShowLayoutSider: boolean;
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
	// 行号
	lineNumbers: "on" | "off" | "relative" | "interval";
	// 自动保存
	autoSave: number;
	// 自动渲染
	autoRender: number;
	// 字体大小
	fontSize: number;
	// 字体样式
	fontFamily: string | undefined;
	// 小地图
	minimap: boolean;
	// 上传图片存放地址
	imgStorageDir: string;
	// 图床
	pictureBed: string;
}

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
