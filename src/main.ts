import { createApp, defineCustomElement } from "vue";
import App from "./App.vue";
import router from "./router";
import EditorPreview from "@/components/editor/preview.ce.vue";
import "@/assets/index.less";
import plugins from "@/plugins";
import ctx from "@/core/context";
import { init } from "@/core/plugin";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { removeDefaultAction } from "@/utils/editor";

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "json") {
			return new jsonWorker();
		}
		if (label === "css" || label === "scss" || label === "less") {
			return new cssWorker();
		}
		if (label === "html" || label === "handlebars" || label === "razor") {
			return new htmlWorker();
		}
		if (label === "typescript" || label === "javascript") {
			return new tsWorker();
		}
		return new editorWorker();
	},
};
removeDefaultAction();

init(plugins, ctx);

!customElements.get("editor-preview") && customElements.define("editor-preview", defineCustomElement(EditorPreview));
const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => ["editor-preview"].includes(tag);
app.use(router);
app.mount("#app");
