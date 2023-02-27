<script lang="ts" setup>
import markdown from "@/assets/markdown.json";
import { NText, type DataTableColumns } from "naive-ui";

const showModal = ref(false);
const columns: DataTableColumns<{ label: string; value: string }> = [
	{
		title: "说明",
		key: "label",
		width: 200,
		render: (_) => {
			return _.label;
		},
	},
	{
		title: "示例",
		key: "value",
	},
];
const show = () => (showModal.value = true);
const renderCell = (value: string) => {
	return h(
		NText,
		{
			style: {
				"white-space": "pre-wrap",
			},
		},
		value
	);
};
defineExpose({
	show,
});
</script>
<template>
	<ShowModal v-model:show="showModal" width="800px" title="Markdown 语法示例">
		<n-data-table :max-height="400" :columns="columns" :data="markdown" striped :render-cell="renderCell" />
	</ShowModal>
</template>
<style lang="less" scoped>
.about {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	line-height: 1.8;
}
</style>
