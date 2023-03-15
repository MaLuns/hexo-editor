<script lang="ts" setup>
import type * as monaco from "monaco-editor";
import ctx from "@/core/context";
import EditorMonaco from "./monaco.vue";
import { configStore, fileStore, themeMode } from "@/store";
import { debounce } from "@/utils";
import { triggerHook } from "@/core/hook";

const emit = defineEmits(["update:modelValue", "save"]);
const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	path: {
		type: String,
		default: "",
	},
	autoRender: {
		type: Number,
		default: 300,
	},
});

const editorMonacoRef = ref<InstanceType<typeof EditorMonaco>>();
const htmlText = ref("");
const theme = computed(() => (themeMode.value ? "dark" : "light"));
const viewId = ref("");
// 缓存编辑器状态
const catchStates = new Map<string | undefined, monaco.editor.ICodeEditorViewState | null>();

let renderMarkdown: (val: string) => void;
watch(
	() => configStore.autoRender,
	(val) => {
		if (val === 0) {
			renderMarkdown = () => "";
		} else {
			renderMarkdown = debounce(async (val: string) => {
				htmlText.value = (await fileStore.fs?.transformImgUrl(ctx.markdown.renderer(val), fileStore.post?.path || "")) || "";
			}, val);
		}
	},
	{ immediate: true }
);

watch(
	() => props.modelValue,
	(val) => renderMarkdown(val),
	{ immediate: true }
);

const handleReady = (e: { editor: monaco.editor.IStandaloneCodeEditor; monaco: any }) => {
	triggerHook("MONACO_MARKDOWN_READY", e);
};

const addModel = (val: string, path: string): monaco.Uri => {
	const uri = ctx.editor.tools.uri(path);
	const payload = editorMonacoRef.value!.getEditor();
	const model = payload.monaco.editor.createModel(val, "md", uri);
	payload.editor.setModel(model);
	viewId.value = uri.path;
	return uri;
};

const setModel = (uri: monaco.Uri) => {
	const payload = editorMonacoRef.value!.getEditor();
	const oldModel = payload.editor.getModel();
	if (oldModel) {
		const oldState = payload.editor.saveViewState();
		catchStates.set(oldModel.uri.toString(), oldState);
	}

	const model = payload.monaco.editor.getModel(uri);
	const newState = catchStates.get(model?.uri.toString());
	payload.editor.setModel(model);
	viewId.value = uri.path;
	if (newState) {
		payload.editor.restoreViewState(newState);
	}
};

const removeModel = (uri: monaco.Uri) => {
	const payload = editorMonacoRef.value!.getEditor();
	const model = payload.monaco.editor.getModel(uri);
	catchStates.delete(uri.toString());
	if (!model?.isDisposed()) {
		model?.dispose();
	}
};

const getModel = (uri: monaco.Uri) => {
	const payload = editorMonacoRef.value!.getEditor();
	return payload.monaco.editor.getModel(uri);
};

defineExpose({
	getModel,
	addModel,
	setModel,
	removeModel,
});
</script>
<template>
	<div class="markdown-editor">
		<div v-show="configStore.layout.isShowMarkdownEditor" class="markdown-editor__editor">
			<editor-monaco ref="editorMonacoRef" language="md" @save="$emit('save')" @change="emit('update:modelValue', $event)" @ready="handleReady"></editor-monaco>
		</div>
		<div v-show="configStore.layout.isShowMarkdownPrew" class="markdown-editor__preview">
			<editor-preview class="editor-preview" :theme="theme" :html="htmlText" :view-id="viewId"></editor-preview>
		</div>
	</div>
</template>
<style lang="less" scoped>
.markdown-editor {
	display: flex;
	height: 100%;

	.markdown-editor__editor,
	.markdown-editor__preview {
		flex: 1;
		flex-shrink: 0;
		width: 50%;
	}

	.editor-preview {
		width: 100%;
		height: 100%;
	}
}
</style>
