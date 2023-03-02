<script lang="ts" setup>
import { triggerHook } from "@/core/hook";
import { editorTheme, configStore } from "@/store";
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
