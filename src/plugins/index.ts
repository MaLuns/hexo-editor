import statusBarHelp from "@/plugins/status-bar-help";
import statusBarTheme from "@/plugins/status-bar-theme";
import statusBarView from "@/plugins/status-bar-view";
import statusBarRenderTiem from "@/plugins/status-bar-render-tiem";
import statusBarDocumentInfo from "@/plugins/status-bar-document-info";
import statusBarInsert from "@/plugins/status-bar-insert";
import markdownTag from "@/plugins/markdown-tag";
import fsLocal from "@/plugins/fs-local";
import markdownToc from "@/plugins/markdown-toc";
import editorPaste from "@/plugins/editor-paste";
import editorMd from "@/plugins/editor-md";
import editorFormatters from "@/plugins/editor-formatters";
import editorKeyboard from "@/plugins/editor-keyboard";
import markdownFrontMatter from "./markdown-front-matter";

export default [
	statusBarView, //
	statusBarInsert,
	statusBarDocumentInfo,
	statusBarTheme,
	statusBarHelp,
	statusBarRenderTiem,
	markdownTag,
	markdownToc,
	markdownFrontMatter,
	editorPaste,
	editorMd,
	editorFormatters,
	editorKeyboard,
	fsLocal,
];
