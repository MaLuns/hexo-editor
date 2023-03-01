<script lang="ts" setup>
import { triggerHook } from "@/core/hook";
import * as monaco from "monaco-editor";
const emit = defineEmits(["change", "save"]);

const props = defineProps({
	value: {
		type: String,
		default: "",
	},
	language: {
		type: String,
		default: "markdown",
	},
	theme: {
		type: String,
		default: "vs",
	},
	config: {
		type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>,
		default: () => {},
	},
	height: {
		type: String,
		default: "300px",
	},
});

const editContainerRef = ref();
const containerHeight = ref("0px");

const def_config: monaco.editor.IStandaloneEditorConstructionOptions = {
	automaticLayout: true,
	selectOnLineNumbers: true,
	fontSize: 14,
	/* minimap: {
        autohide: true
    }, */
	fixedOverflowWidgets: true,
	unicodeHighlight: {
		ambiguousCharacters: false,
	},
	glyphMargin: false,
	padding: {
		top: 4,
		bottom: 4,
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
};

let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;
onMounted(() => {
	containerHeight.value = useAutoParentHeight(props.height);
	nextTick(() => {
		monacoEditor = monaco.editor.create(editContainerRef.value, {
			...def_config,
			...props.config,
			language: props.language,
			value: props.value,
		});

		monacoEditor.onDidChangeModelContent(() => {
			emit("change", monacoEditor!.getValue());
		});

		monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
			emit("save");
		});

		setTimeout(() => {
			triggerHook("MONACO_READY", { editor: monacoEditor, monaco: monaco });
		}, 500);
	});
});

defineExpose({
	getEditor() {
		return monacoEditor;
	},
});
</script>

<template>
	<div ref="editContainerRef" :style="{ height: containerHeight }"></div>
</template>
