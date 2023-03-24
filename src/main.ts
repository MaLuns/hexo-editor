import { createApp, defineCustomElement } from "vue";
import App from "./App.vue";
import router from "./router";
import EditorPreview from "@/components/editor/preview.ce.vue";
import "@/assets/index.less";
import plugins from "@/plugins";
import ctx from "@/core/context";
import { init } from "@/core/plugin";

init(plugins, ctx);

!customElements.get("editor-preview") && customElements.define("editor-preview", defineCustomElement(EditorPreview));
const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => ["editor-preview"].includes(tag);
app.use(router);
app.mount("#app");
