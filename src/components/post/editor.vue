<script lang="ts" setup>
import { CloseSharp } from "@vicons/ionicons5";
import { fileStore } from "@/store";

const dialog = useDialog();
const emit = defineEmits(["select"]);

const options = [
	{ label: "关闭其他", value: "other" },
	{ label: "关闭已保存", value: "save" },
	{ label: "全部关闭", value: "all" },
];
const data = reactive({
	tabName: "",
	tabs: [] as Array<PostModel>,
});

watchEffect(() => {
	const tab = data.tabs.find((item) => item.path === data.tabName);
	fileStore.post = tab || null;
	/* emit("select", tab?.path); */
});

const closeTabs = (name: string) => {
	const index = data.tabs.findIndex((item) => item.path === name);
	const closeTab = data.tabs[index];
	const clostFn = () => {
		data.tabs.splice(index, 1);
		if (data.tabName === name) {
			let tab = data.tabs[Math.max(0, index - 1)];
			data.tabName = tab ? tab.path : "";
			emit("select", data.tabName);
		}
	};
	if (closeTab.md !== closeTab.frontmatter._content) {
		dialog.warning({
			title: "提示",
			transformOrigin: "center",
			content: "当前文章未保存，确定关闭吗？",
			positiveText: "确定",
			negativeText: "取消",
			style: {
				width: "400px",
				position: "fixed",
				top: "100px",
				left: 0,
				right: 0,
			},
			onPositiveClick: () => {
				clostFn();
			},
		});
	} else {
		clostFn();
	}
};

const changeTabs = (path: string) => {
	const tab = data.tabs.find((item) => item.path === path);
	emit("select", tab?.path);
};

const handleSave = async (post: PostModel) => {
	let res = await fileStore.fs?.savePost(post);
	if (res) {
		post.frontmatter._content = post.md;
	} else {
		window.$message.warning("文章保存失败");
	}
};

const handleCloseTabs = (val: string) => {
	if (val === "other") {
		data.tabs = data.tabs.filter((item) => item.path === data.tabName);
	} else if (val === "save") {
		data.tabs = data.tabs.filter((item) => item.md !== item.frontmatter._content);
		if (data.tabs.length) {
			const tab = data.tabs.find((item) => item.path === data.tabName);
			if (!tab) {
				data.tabName = data.tabs[0].path;
			}
		} else {
			data.tabName = "";
		}
		emit("select", data.tabName);
	} else {
		data.tabs = [];
		data.tabName = "";
		emit("select", "");
	}
};

const add = (post: PostModel) => {
	let item = data.tabs.find((item) => item.path === post.path);
	if (!item) {
		data.tabs.push(post);
	}
	data.tabName = post.path;
};

const remove = (path: string) => {
	data.tabs = data.tabs.filter((item) => item.path !== path);
};

defineExpose({
	add,
	remove,
});
</script>
<template>
	<n-tabs v-model:value="data.tabName" size="small" type="card" closable tab-style="min-width: 120px;" pane-style="height:calc(100vh - 40px);" @update:value="changeTabs" @close="closeTabs">
		<n-tab-pane v-for="panel in data.tabs" :key="panel.path" class="tab-pane" :tab="panel.path" :name="panel.path" display-directive="show:lazy">
			<template #tab>
				{{ panel.name }}
				<span v-if="panel.md !== panel.frontmatter._content" class="save-tag" title="未保存"></span>
			</template>
			<EditorMarkdown v-model="panel.md" :path="panel.path" @save="handleSave(panel)"> </EditorMarkdown>
		</n-tab-pane>

		<template v-if="data.tabs.length" #suffix>
			<n-popselect :options="options" @change="handleCloseTabs">
				<n-icon size="22">
					<CloseSharp />
				</n-icon>
			</n-popselect>
		</template>
	</n-tabs>
</template>
<style lang="less" scoped>
.n-tabs {
	:deep(.n-tabs-tab-wrapper) {
		.n-tabs-tab-pad {
			display: none;
		}
		.n-tabs-tab {
			border-radius: 0;
			border: 0 !important;
			border-left: 1px solid var(--n-tab-border-color) !important;
			background-color: #f1f1fa;
			color: rgba(51, 51, 51, 0.7);
		}
	}

	:deep(.n-tabs-pad) {
		background-color: #f9f9f9;
	}
	:deep(.n-tabs-nav__suffix) {
		background-color: #f9f9f9;
		cursor: pointer;
		padding: 0 8px;
	}
}

.tab-pane {
	padding: 0;

	:deep(.v-md-editor) {
		box-shadow: none;
	}
}

.save-tag {
	display: inline-block;
	width: 10px;
	height: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #e2bf5d;
	border-radius: 50%;
	margin-left: 10px;
}
</style>
