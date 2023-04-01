declare interface FileStoreModel {
	id?: string;
	name: string;
	type: any;
	value: FileStoreModel.type extends "LocalFileSystem" ? FileSystemDirectoryHandle : string;
}

declare type LabelVal = {
	label: string;
	value: any;
};

/**
 * Hook 类型
 */
declare type HookTypes = {
	/**
	 * 编辑器初始化
	 */
	MONACO_READY: { editor: Monaco.editor.IStandaloneCodeEditor; monaco: typeof Monaco };
	/**
	 * MD 编辑器初始化
	 */
	MONACO_MARKDOWN_READY: { editor: Monaco.editor.IStandaloneCodeEditor; monaco: typeof Monaco };
	/**
	 *  编辑器光标位置发生变化
	 */
	MONACO_EDITOR_CURSOR_POSITION: {
		line: number;
		column: number;
		lineCount: number;
		textLength: number;
		selectedLength: number;
		selectedLines: number;
		selectionCount: number;
	};
	/**
	 * 编辑器组件激活
	 */
	MONACO_ACTIVATE: Monaco.editor.IStandaloneCodeEditor | null;
	/**
	 * MD 渲染前
	 */
	MARKDOWN_RENDER_BEFORE: string;
	/**
	 * MD 渲染后
	 */
	MARKDOWN_RENDER_AFTER: { text: string; html: string };
	/**
	 * 目录列表点击事件
	 */
	TOC_LIST_CLICK: TocNode;
	/**
	 *  恢复文档
	 */
	RESTORE_DEFAULT_DOCUMENT: Monaco.editor.IStandaloneCodeEditor;
};

/**
 * 布局配置
 */
declare interface LayoutConfig {
	/**
	 *	布局-侧栏菜单栏宽度
	 */
	layoutSiderWidth: string;
	/**
	 *	布局-底部状态栏高度
	 */
	layoutFooterBar: string;
	/**
	 *	布局-编辑区-文章列表宽度
	 */
	editorAsideWidth: string;
	/**
	 *	布局-是否显示侧栏菜单
	 */
	isShowLayoutSider: boolean;
	/**
	 *	布局-是否显示编辑区-文章列表
	 */
	isShowLayoutEditorAside: boolean;
	/**
	 *	布局-是否显示编辑器
	 */
	isShowMarkdownEditor: boolean;
	/**
	 *	布局-是否显示预览
	 */
	isShowMarkdownPrew: boolean;
}

/**
 * 编辑器配置
 */
declare interface EditorOptions {
	/**
	 * 行号
	 */
	lineNumbers: "on" | "off" | "relative" | "interval";
	/**
	 * 字体大小
	 */
	fontSize: number;
	/**
	 * 字体样式
	 */
	fontFamily: string | undefined;
	/**
	 * minimap
	 */
	minimap: {
		enabled: boolean;
		renderCharacters: boolean;
	};
	/**
	 * 换行
	 */
	wordWrap: "off" | "on" | "wordWrapColumn" | "bounded";
	/**
	 * 滚轮缩放
	 */
	mouseWheelZoom: boolean;
}

/**
 * 全局配置
 */
declare interface GlobalConfig {
	/**
	 * 布局
	 */
	layout: LayoutConfig;
	/**
	 * 主题
	 */
	theme: "light" | "dark" | "system";
	/**
	 * 语言
	 */
	language: "zh-CN" | "en";
	/**
	 * 预览样式
	 */
	preStyle: string;
	/**
	 * 预览标签
	 */
	preTag: string;
	/**
	 * 预览标签类
	 */
	preClass: string;
	/**
	 * 编辑器样式
	 */
	editorLightTheme: string;
	/**
	 * 编辑器样式
	 */
	editorDartTheme: string;
	/**
	 * 编辑器配置
	 */
	editorOption: EditorOptions;
	/**
	 * 自动保存
	 */
	autoSave: number;
	/**
	 * 自动渲染
	 */
	autoRender: number;
	/**
	 * 隐藏 Front-Matter
	 */
	hideFrontMatter: boolean;
	/**
	 * 图片存储方式
	 */
	imgStorageType: "Local";
	/**
	 * 上传图片存放地址
	 */
	imgStorageDir: string;
	/**
	 * 图床
	 */
	pictureBed: string;
}

/**
 * 主题颜色变量
 */
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

/**
 * 文章目录
 */
declare interface TocNode {
	/**
	 *  ID
	 */
	id: string;
	/**
	 * 目录层级
	 */
	level: number;
	/**
	 * 标题
	 */
	text: string;
	/**
	 * 子目录
	 */
	children: TocNode[];
}

/**
 * 状态栏菜单
 */
declare interface StatusMenu {
	/**
	 * 状态栏 ID
	 */
	id: string;
	/**
	 * 状态栏标题
	 */
	title?: string | Component | Ref<string>;
	/**
	 * 提示
	 */
	tips?: string; // not available for vue component title
	/**
	 * 图标
	 */
	icon?: Component; // not available for vue component title
	/**
	 * 是否隐藏
	 */
	hidden?: boolean | ComputedRef<boolean> | Ref<boolean>;
	/**
	 * 显示状态栏位置
	 */
	position: "left" | "right" | "center";
	/**
	 * 排序
	 */
	order?: number;
	/**
	 * 子级状态栏
	 */
	list?: StatusMenuItem[];
	/**
	 * 状态栏 click 事件
	 */
	onClick?: (menu: StatusMenu) => void;
	/**
	 * 状态栏 mousedown 事件
	 */
	onMousedown?: (menu: StatusMenu) => void;
}

/**
 * 状态栏子菜单
 */
declare type StatusMenuItem =
	| {
			/**
			 * 子级 ID
			 */
			id: string;
			/**
			 * 子级标题
			 */
			title: string;
			/**
			 * 子级类型
			 */
			type: "normal";
			/**
			 * 子级副标题
			 */
			subTitle?: string;
			/**
			 * 是否禁用
			 */
			disabled?: boolean;
			/**
			 * 是否隐藏
			 */
			hidden?: boolean | ComputedRef<boolean> | Ref<boolean>;
			/**
			 * 是否选中
			 */
			checked?: boolean | ComputedRef<boolean> | Ref<boolean>;
			/**
			 *  click 事件
			 */
			onClick?: (item: StatusMenuItem, menu: StatusMenu) => void;
	  }
	| {
			type: "separator";
			hidden?: boolean;
	  };

/**
 * 命令面板
 */
declare interface CommandPalette {
	/**
	 * 命令 ID
	 */
	id: string;
	/**
	 * 命令标题
	 */
	title: string | Ref<string>;
	/**
	 * 图标
	 */
	icon?: string;
	/**
	 * 命令描述
	 */
	desc?: string;
	/**
	 * 快捷键字符串
	 */
	keybindLabel?: string[];
	/**
	 * 快捷键
	 */
	keybinding?: number[];
	/**
	 * 预览选择 command 时，钩子
	 */
	select?: (t: CommandPalette) => void;
	/**
	 * 执行 command 钩子
	 */
	handle?: (t: CommandPalette) => void;
	/**
	 * 子集命令
	 */
	children?: CommandPalette[];
}

declare type Flat<T extends Record<string, any>, P extends string = ""> = {
	[K in keyof T as T[K] extends Record<string, any> ? keyof Flat<T[K], `${P}${K}.`> : `${P}${K}`]: never;
};

/**
 * config 表单配置
 */
declare interface FromConfig {
	title: string | Ref<string>;
	key: keyof Flat<GlobalConfig>;
	type: "input" | "select" | "slider" | "switch";
	isCommand?: boolean;
	attr?: {
		options?: LabelVal[];
		[k: string]: any;
	};
}
