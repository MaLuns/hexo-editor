<script lang="ts" setup>
import { triggerHook } from "@/core/hook";
import { editorTheme, configStore } from "@/store";
import { debounce } from "@/utils";
import * as monaco from "monaco-editor";
const emit = defineEmits(["change", "save", "ready"]);

const editContainerRef = ref();
const containerHeight = ref("0px");
const props = defineProps({
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
	smoothScrolling: true,
	scrollbar: {
		verticalScrollbarSize: 0,
	},
	model: null,
	...configStore.editorOption,
	fontFamily: configStore.editorOption.fontFamily || undefined,
};

let monacoEditor: monaco.editor.IStandaloneCodeEditor;
let autoSave = () => {};

watch(
	() => configStore.autoSave,
	(val) => {
		if (val === 0) {
			autoSave = () => {};
		} else {
			autoSave = debounce(() => emit("save"), val);
		}
	},
	{ immediate: true }
);

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
			autoSave();
		});

		monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
			emit("save");
		});

		const runHook = () => {
			const selection = monacoEditor.getSelection();
			if (selection) {
				triggerHook("MONACO_EDITOR_CURSOR_POSITION", {
					line: selection.positionLineNumber,
					column: selection.positionColumn,
					lineCount: monacoEditor.getModel()!.getLineCount(),
					textLength: monacoEditor.getValue().length,
					selectedLength: monacoEditor.getModel()!.getValueInRange(selection).length,
					selectedLines: selection.endLineNumber - selection.startLineNumber + 1,
					selectionCount: monacoEditor.getSelections()?.length || 1,
				});
			} else {
				triggerHook("MONACO_EDITOR_CURSOR_POSITION", {
					line: 0,
					column: 0,
					lineCount: 0,
					textLength: 0,
					selectedLength: 0,
					selectedLines: 0,
					selectionCount: 0,
				});
			}
		};

		monacoEditor.onDidChangeModel(function () {
			runHook();
		});

		monacoEditor.onDidChangeCursorSelection(runHook);

		setTimeout(() => {
			emit("ready", { editor: monacoEditor, monaco: monaco });
			triggerHook("MONACO_ACTIVATE", { editor: monacoEditor, monaco: monaco });
			triggerHook("MONACO_ACTIVATE", monacoEditor);
		}, 500);
	});
});

onActivated(() => {
	triggerHook("MONACO_ACTIVATE", monacoEditor);
});

onDeactivated(() => {
	triggerHook("MONACO_ACTIVATE", null);
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
