<script lang="ts" setup>
import type * as monaco from "monaco-editor";
import EditorMonaco from "@/components/editor/monaco.vue";
import ctx from "@/core/context";
import { fileStore } from "@/store";

const message = useMessage();

const catchStates = new Map<string | undefined, monaco.editor.ICodeEditorViewState | null>();
const editorMonacoRef = ref<InstanceType<typeof EditorMonaco>>();

const tabs = ref<"hexo" | "theme">("hexo");
const defData = { path: "", raw: "", val: "" };
const data = reactive({
	hexo: { ...defData },
	theme: { ...defData },
});

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

const switchModel = async (type: "hexo" | "theme") => {
	tabs.value = type;
	const payload = editorMonacoRef.value!.getEditor();
	const uri = ctx.editor.tools.uri(type);
	const model = payload.monaco.editor.getModel(uri);

	if (model) return setModel(uri);

	const config = type === "hexo" ? await ctx.store.fileStore.fs?.getHexoConfig() : await ctx.store.fileStore.fs?.getThemeConfig();

	if (config && config.raw) {
		payload.monaco.editor.createModel(config.raw, "yaml", uri);
		data[type].raw = data[type].val = config.raw;
		data[type].path = config.path;
		return setModel(uri);
	}
};

const handleChange = (val: string) => {
	data[tabs.value].val = val;
};

const handleSave = () => {
	const config = data[tabs.value];
	fileStore.fs?.updateFile(config.path, config.val).then((res) => {
		if (res) {
			config.raw = config.val;
			message.info("保存成功");
		}
	});
};

const handleReady = async () => {
	switchModel("hexo");
};
</script>
<template>
	<div class="config-editor">
		<n-radio-group v-model:value="tabs" name="radiogroup" :on-update:value="switchModel" style="margin-bottom: 10px">
			<n-radio value="hexo">
				<div class="w-120">
					Hexo 配置文件
					<state-tag v-if="data.hexo.raw !== data.hexo.val" state="warning"></state-tag>
				</div>
			</n-radio>
			<n-radio value="theme">
				<div class="w-120">
					主题配置文件
					<state-tag v-if="data.theme.raw !== data.theme.val" state="warning"></state-tag>
				</div>
			</n-radio>
		</n-radio-group>
		<editor-monaco ref="editorMonacoRef" class="editor" language="yaml" @save="handleSave" @change="handleChange" @ready="handleReady"></editor-monaco>
	</div>
</template>
<style lang="less" scoped>
.config-editor {
	height: 100%;
	display: flex;
	flex-direction: column;

	.editor {
		flex: 1;
	}
	.state-tag {
		margin-left: 6px;
	}
}
</style>
