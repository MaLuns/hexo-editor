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
	commnad,
	discrete,
	editor,
	fs,
	hexo,
	hook,
	markdown,
	statusBar,
	store,
});

export type Ctx = typeof ctx;
export default ctx;
