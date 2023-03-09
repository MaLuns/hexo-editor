<script lang="ts" setup>
import type { Uri } from "monaco-editor";
import EditorMarkdown from "@/components/editor/markdown.vue";
import { fileStore } from "@/store";

type models = {
	[k: string]: {
		text: string;
		raw: string;
		uri: Uri;
		post: PostModel;
	};
};

const dialog = useDialog();
const emit = defineEmits(["select"]);
const editorMarkdownRef = ref<InstanceType<typeof EditorMarkdown>>();
const data = reactive({
	tabValue: "",
	text: "",
	models: {} as models,
});

const list = computed(() => {
	return Object.keys(data.models)
		.filter((key) => key !== "")
		.map((key) => {
			const item = data.models[key];
			return {
				label: item.post.name,
				value: item.post.path,
				state: item.text !== item.raw ? 1 : 0,
			};
		});
});

const handleClose = async (type: string, val: string) => {
	const paths = list.value.map((item) => item.value);
	let flag: boolean = false;
	const removeModels = (keys: string[] | string): Promise<boolean> => {
		return new Promise((resolve) => {
			if (!Array.isArray(keys)) keys = [keys];
			const noSave = keys.find((item) => data.models[item].raw !== data.models[item].text) !== undefined;
			const remove = () => {
				(keys as string[]).forEach((item) => {
					editorMarkdownRef.value!.removeModel(data.models[item].uri);
					delete data.models[item];
				});
			};
			if (noSave) {
				dialog.warning({
					title: "提示",
					transformOrigin: "center",
					content: "当前文章未保存，确定关闭吗？",
					positiveText: "确定",
					negativeText: "取消",
					maskClosable: false,
					style: {
						width: "400px",
						position: "fixed",
						top: "100px",
						left: 0,
						right: 0,
					},
					onPositiveClick: () => {
						remove();
						resolve(true);
					},
					onEsc: () => resolve(false),
					onNegativeClick: () => resolve(false),
					onClose: () => resolve(false),
				});
			} else {
				remove();
				resolve(true);
			}
		});
	};

	if (type === "close") {
		flag = await removeModels(val);
		if (flag) {
			if (data.tabValue === val) {
				const index = paths.findIndex((item) => item === val);
				paths.splice(index, 1);
				const path = paths[Math.max(0, index - 1)];
				data.tabValue = path ? path : "";
			}
		}
	} else if (type === "other") {
		flag = await removeModels(paths.filter((item) => item !== val));
		if (flag) data.tabValue = val;
	} else if (type === "save") {
		const savePaths = list.value.filter((item) => item.state === 0).map((item) => item.value);
		if (savePaths.includes(val)) {
			const item = list.value.find((item) => item.state === 1);
			if (item) data.tabValue = item.value;
			else data.tabValue = "";
		}
		removeModels(savePaths);
	} else if (type === "all") {
		flag = await removeModels(paths);
		if (flag) data.tabValue = "";
	}
};

const handleSave = () => {
	const post = data.models[data.tabValue];
	if (post) {
		const res = fileStore.fs?.savePost({
			...post.post,
			md: post.text,
		});
		if (res) {
			post.post.md = post.raw = post.text;
		} else {
			window.$message.warning("文章保存失败");
		}
	}
};

const add = (post: PostModel) => {
	data.tabValue = post.path;
	const model = data.models[post.path];
	if (model) {
		editorMarkdownRef.value?.setModel(model.uri);
	} else {
		data.models[post.path] = {
			text: post.md,
			raw: post.md,
			uri: editorMarkdownRef.value!.addModel(post.md, "/" + post.path),
			post: post,
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

const modelValue = computed({
	get: () => {
		return data.models[data.tabValue]?.text || "";
	},
	set: (val) => {
		if (data.models[data.tabValue]) {
			data.models[data.tabValue].text = val;
		}
	},
});

defineExpose({
	add,
	remove,
});
</script>
<template>
	<div class="post-editor">
		<div class="post-editor__tabs">
			<post-tabs v-model="data.tabValue" :list="list" @close="handleClose">
				<template #suffix>
					<post-toc></post-toc>
				</template>
			</post-tabs>
		</div>
		<div class="post-editor__container">
			<editor-markdown ref="editorMarkdownRef" v-model="modelValue" @save="handleSave"></editor-markdown>
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
