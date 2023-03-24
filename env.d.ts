/// <reference types="vite/client" />
declare module "*.json";
declare module "monaco-editor/esm/vs/basic-languages/markdown/markdown";
declare module "monaco-editor/esm/vs/basic-languages/yaml/yaml";
declare module "monaco-editor/esm/vs/platform/actions/common/actions";
declare module "monaco-editor/esm/vs/base/browser/keyboardEvent";
declare module "monaco-editor/esm/vs/base/common/keybindingLabels";
declare interface Window {
	$message: MessageApiInjection;
	registerPlugin: any;
	fjGallery?: any;
}
