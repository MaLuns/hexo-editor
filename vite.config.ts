import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/

export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				manualChunks: (e) => {
					if (e.includes("/node_modules/monaco-editor/")) return "monaco";
				},
			},
		},
	},
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.includes(".ce.vue"),
				},
			},
		}),
		AutoImport({
			dirs: ["src/composables"],
			dts: true,
			imports: [
				"vue",
				"vue-router",
				{
					"naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"],
				},
			],
			eslintrc: {
				// 已存在文件设置默认 false，需要更新时再打开，防止每次更新都重新生成
				enabled: false,
				filepath: "./.eslintrc-auto-import.json",
				globalsPropValue: true,
			},
		}),
		Components({
			resolvers: [NaiveUiResolver()],
			dts: true,
			directoryAsNamespace: true,
			types: [
				{
					from: "vue-router",
					names: ["RouterLink", "RouterView"],
				},
			],
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
