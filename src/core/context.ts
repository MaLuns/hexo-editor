import * as hook from "@/core/hook";
import * as statusBar from "@/core/status-bar";
import * as store from "@/store";
import * as markdown from "@/core/markdown";
import * as editor from "@/core/editor";
import * as hexo from "@/core/hexo";
import * as commnad from "@/core/command";
import fs from "@/core/file-system";
import discrete from "@/core/discrete";

const ctx = Object.freeze({
	/**
	 * 命令面板
	 */
	commnad,
	/**
	 * 全局 message、notification 组件实例
	 */
	discrete,
	/**
	 * Monaco 编辑器
	 */
	editor,
	/**
	 * 文件系统
	 */
	fs,
	/**
	 * Hexo 相关操作方法集合
	 */
	hexo,
	/**
	 * Hook 注册、移除、执行操作
	 */
	hook,
	/**
	 * Markdown 渲染操作
	 */
	markdown,
	/**
	 * 状态栏
	 */
	statusBar,
	store,
});

export type Ctx = typeof ctx;
export default ctx;
