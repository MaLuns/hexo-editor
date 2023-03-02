<script lang="ts" setup>
import { registerHook } from "@/core/hook";
import { fileStore, themeMode } from "@/store";
import { debounce } from "@/utils";
import { regPaste } from "@/utils/editor";
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
});

const editorMonacoRef = ref();
const htmlText = ref("");
const theme = computed(() => {
	return themeMode.value ? "dark" : "light";
});
const data = reactive({
	preview: props.preview,
});

const renderMarkdown = debounce(async (val: string) => {
	htmlText.value = (await fileStore.fs?.transformImgUrl(renderer(val), props.path)) || "";
}, 300);

const handleChange = async (val: string) => {
	emit("update:modelValue", val);
	renderMarkdown(val);
};

if (props.modelValue) {
	renderMarkdown(props.modelValue);
}

registerHook(
	"MONACO_READY",
	(payload) => {
		regPaste(payload.editor);
	},
	true
);
</script>
<template>
	<div class="markdown-editor">
		<!-- <div class="markdown-editor__header">
			<EditorToolbar></EditorToolbar>
		</div> -->
		<div class="markdown-editor__main">
			<div class="markdown-editor__editor">
				<EditorMonaco ref="editorMonacoRef" :value="props.modelValue" language="md" @save="$emit('save')" @change="handleChange"> </EditorMonaco>
			</div>
			<div v-if="data.preview" class="markdown-editor__preview">
				<editor-preview class="editor-preview" :theme="theme" :html="htmlText"></editor-preview>
			</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
.markdown-editor {
	display: flex;
	height: 100%;
	flex-direction: column;

	.markdown-editor__header {
		flex-shrink: 0;
		height: 36px;
		border-bottom: 1px solid #eee;
		display: flex;
		justify-content: space-between;
		padding: 0 1rem;
	}

	.markdown-editor__main {
		display: flex;
		flex: 1;
		flex-shrink: 0;
		height: calc(100% - 36px);

		.markdown-editor__editor,
		.markdown-editor__preview {
			flex: 1;
			flex-shrink: 0;
			width: 50%;
		}
	}

	.editor-preview {
		width: 100%;
		height: 100%;
	}
}
</style>
