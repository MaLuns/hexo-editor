import statusBarHelp from "@/plugins/status-bar-help";
import statusBarTheme from "@/plugins/status-bar-theme";
import statusBarView from "@/plugins/status-bar-view";
import statusBarRenderTiem from "@/plugins/status-bar-render-tiem";
import statusBarDocumentInfo from "@/plugins/status-bar-document-info";
import statusBarInsert from "@/plugins/status-bar-insert";
import markdownTag from "@/plugins/markdown-tag";
import fsLocal from "@/plugins/fs-local";
import markdownToc from "./markdown-toc";

export default [statusBarView, statusBarInsert, statusBarDocumentInfo, statusBarHelp, statusBarTheme, statusBarRenderTiem, markdownTag, markdownToc, fsLocal];
