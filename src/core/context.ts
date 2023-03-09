import * as hook from "@/core/hook";
import * as statusBar from "@/core/status-bar";
import * as store from "@/store";
import * as markdown from "@/core/markdown";
import * as editor from "@/core/editor";
import fs from "@/core/file-system";

const ctx = Object.freeze({
	editor,
	fs,
	hook,
	markdown,
	statusBar,
	store,
});

export type Ctx = typeof ctx;
export default ctx;
