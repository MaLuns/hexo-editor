/// <reference types="vite/client" />
declare module "*.json";
declare module "monaco-editor/esm/vs/basic-languages/markdown/markdown";
declare module "monaco-editor/esm/vs/basic-languages/yaml/yaml";
declare interface Window {
	$message: MessageApiInjection;
	fjGallery?: any;
}
