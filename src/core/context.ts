import * as hook from "@/core/hook";
import * as statusBar from "@/core/status-bar";
import * as store from "@/store";
import * as markdown from "@/core/markdown";
import fs from "@/core/file-system";

const ctx = Object.freeze({
	fs,
	hook,
	statusBar,
	store,
	markdown,
});

export type Ctx = typeof ctx;
export default ctx;
