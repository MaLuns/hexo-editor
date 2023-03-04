<script lang="ts" setup>
import type { Uri } from "monaco-editor";
import { uri } from "@/utils/editor";
import EditorMarkdown from "@/components/editor/markdown.vue";

type models = {
	[k: string]: {
		uri: Uri;
		name: string;
		path: string;
		text: string;
		raw: string;
	};
};

const defaultModel = {
	name: "",
	path: "",
	text: "",
	raw: "",
	uri: uri("/"),
};

const emit = defineEmits(["select"]);
const editorMarkdownRef = ref<InstanceType<typeof EditorMarkdown>>();
const data = reactive({
	tabValue: "",
	models: {
		[""]: defaultModel,
	} as models,
});

const list = computed(() => {
	return Object.keys(data.models)
		.filter((key) => key !== "")
		.map((key) => {
			const item = data.models[key];
			return {
				label: item.name,
				value: item.path,
				state: item.text !== item.raw ? 1 : 0,
			};
		});
});

const handleClose = (type: string, val: string) => {
	const paths = list.value.map((item) => item.value);
	const removeModels = (keys: string[] | string) => {
		if (Array.isArray(keys)) {
			keys.forEach((item) => {
				editorMarkdownRef.value!.removeModel(data.models[item].uri);
				delete data.models[item];
			});
		} else {
			editorMarkdownRef.value!.removeModel(data.models[keys].uri);
			delete data.models[keys];
		}
	};

	if (type === "close") {
		removeModels(val);
		const index = paths.findIndex((item) => item === val);
		if (data.tabValue === val) {
			paths.splice(index, 1);
			const path = paths[Math.max(0, index - 1)];
			data.tabValue = path ? path : "";
		}
	} else if (type === "other") {
		data.tabValue = val;
		removeModels(paths.filter((item) => item !== val));
	} else if (type === "save") {
		const savePaths = list.value.filter((item) => item.state === 0).map((item) => item.value);
		if (savePaths.includes(val)) {
			const item = list.value.find((item) => item.state === 1);
			if (item) data.tabValue = item.value;
			else data.tabValue = "";
		}
		removeModels(savePaths);
	} else if (type === "all") {
		removeModels(paths);
		data.models = {
			[""]: defaultModel,
		};
		data.tabValue = "";
	}
};

const handleSave = () => {
	console.log(data.models[data.tabValue]);
};

const add = (post: PostModel) => {
	data.tabValue = post.path;
	const model = data.models[post.path];
	if (model) {
		editorMarkdownRef.value?.setModel(model.uri);
	} else {
		data.models[post.path] = {
			name: post.name,
			path: post.path,
			text: post.md,
			raw: post.md,
			uri: editorMarkdownRef.value!.addModel(post.md, "/" + post.path),
		};
	}
};

const remove = (path: string) => handleClose("close", path);

watch(
	() => data.tabValue,
	(tabValue) => {
		const model = data.models[tabValue];
		if (model) editorMarkdownRef.value!.setModel(model.uri);
		emit("select", tabValue);
	}
);

defineExpose({
	add,
	remove,
});
</script>
<template>
	<div class="post-editor">
		<div class="post-editor__tabs">
			<PostTabs v-model="data.tabValue" :list="list" @close="handleClose">
				<slot></slot>
			</PostTabs>
		</div>
		<div class="post-editor__container">
			<EditorMarkdown ref="editorMarkdownRef" v-model="data.models[data.tabValue].text" @save="handleSave"></EditorMarkdown>
		</div>
	</div>
</template>
<style lang="less" scoped>
.post-editor {
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	.post-editor__tabs {
		height: 35px;
		/* background-color: red; */
		flex-shrink: 0;
	}

	.post-editor__container {
		flex: 1;
		flex-shrink: 0;
		overflow: hidden;
	}
}
</style>
