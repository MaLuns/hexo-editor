<script lang="ts" setup>
import { editorTheme, configStore } from "@/store";
import * as monaco from "monaco-editor";
const emit = defineEmits(["change", "save", "ready"]);

const editContainerRef = ref();
const containerHeight = ref("0px");
const props = defineProps({
	value: {
		type: String,
		default: "",
	},
	language: {
		type: String,
		default: "markdown",
	},
	config: {
		type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>,
		default: () => {},
	},
	height: {
		type: String,
		default: "300px",
	},
	hookPrefix: {
		type: String,
		default: "",
	},
});

const def_config: monaco.editor.IStandaloneEditorConstructionOptions = {
	theme: editorTheme.value,
	lineNumbers: configStore.lineNumbers,
	minimap: {
		enabled: configStore.minimap,
	},
	fontSize: configStore.fontSize,
	fontFamily: configStore.fontFamily,
	automaticLayout: true,
	selectOnLineNumbers: true,
	fixedOverflowWidgets: true,
	unicodeHighlight: {
		ambiguousCharacters: false,
	},
	glyphMargin: false,
	padding: {
		top: 10,
		bottom: 10,
	},
	contextmenu: true,
	hover: {
		enabled: false,
	},
	folding: true,
	scrollBeyondLastLine: false,
	overviewRulerBorder: false,
	hideCursorInOverviewRuler: true,
	scrollbar: {
		/* vertical: 'hidden' */
		verticalScrollbarSize: 0,
	},
	model: null,
	wordWrap: "on",
};

let monacoEditor: monaco.editor.IStandaloneCodeEditor;
onMounted(() => {
	containerHeight.value = useAutoParentHeight(props.height);
	nextTick(() => {
		monacoEditor = monaco.editor.create(editContainerRef.value, {
			...def_config,
			...props.config,
			language: props.language,
		});

		monacoEditor.onDidChangeModelContent(() => {
			emit("change", monacoEditor!.getValue());
		});

		monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
			emit("save");
		});

		setTimeout(() => {
			emit("ready", { editor: monacoEditor, monaco: monaco });
		}, 500);
	});
});

defineExpose({
	getEditor() {
		return { editor: monacoEditor, monaco: monaco };
	},
});
</script>

<template>
	<div ref="editContainerRef" :style="{ height: '100%' }"></div>
</template>
