import * as hook from "./hook";
import * as statusBar from "./statusBar";
import * as store from "@/store";

const ctx = Object.freeze({
	hook,
	statusBar,
	store,
});

export type Ctx = typeof ctx;
export default ctx;
