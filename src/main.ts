import { createApp, defineCustomElement } from "vue";
import App from "./App.vue";
import router from "./router";
import EditorPreview from "@/components/editor/preview.ce.vue";
import "@/assets/index.less";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { initAction, removeDefaultAction } from "@/utils/editor";

removeDefaultAction();
initAction(["insert-date", "themes"]);

!customElements.get("editor-preview") && customElements.define("editor-preview", defineCustomElement(EditorPreview));
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

const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => {
	return ["editor-preview"].includes(tag);
};
app.use(router);
app.mount("#app");
