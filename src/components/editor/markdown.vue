<script lang="ts" setup>
import type * as monaco from "monaco-editor";
import EditorMonaco from "./monaco.vue";
import { fileStore, themeMode } from "@/store";
import { debounce } from "@/utils";
import { regPaste, uri } from "@/utils/editor";
import { renderer } from "@/utils/md";

const emit = defineEmits(["update:modelValue", "save"]);
const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	preview: {
		type: Boolean,
		default: true,
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
const catchStates = new Map<string | undefined, monaco.editor.ICodeEditorViewState | null>();

let renderMarkdown: (val: string) => void;
watch(
	() => props.autoRender,
	() => {
		renderMarkdown = debounce(async (val: string) => {
			htmlText.value = (await fileStore.fs?.transformImgUrl(renderer(val), props.path)) || "";
		}, props.autoRender);
	},
	{
		immediate: true,
	}
);
watch(
	() => props.modelValue,
	(val) => renderMarkdown(val),
	{
		immediate: true,
	}
);

const handleReady = (e: { editor: monaco.editor.IStandaloneCodeEditor; monaco: any }) => {
	regPaste(e.editor);
};

const addModel = (val: string, path: string): monaco.Uri => {
	const u = uri(path);
	const payload = editorMonacoRef.value!.getEditor();
	const model = payload.monaco.editor.createModel(val, "md", u);
	payload.editor.setModel(model);
	return u;
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

defineExpose({
	addModel,
	setModel,
	removeModel,
});
</script>
<template>
	<div class="markdown-editor">
		<div class="markdown-editor__editor">
			<EditorMonaco ref="editorMonacoRef" :value="props.modelValue" language="md" @save="$emit('save')" @change="emit('update:modelValue', $event)" @ready="handleReady"></EditorMonaco>
		</div>
		<div v-if="props.preview" class="markdown-editor__preview">
			<editor-preview class="editor-preview" :theme="theme" :html="htmlText"></editor-preview>
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
