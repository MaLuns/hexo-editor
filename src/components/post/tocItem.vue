<script lang="ts" setup>
import { triggerHook } from "@/core/hook";
import { themeColors } from "@/store";

defineProps({
	list: {
		type: Array<TocNode>,
		default: () => [],
	},
});

const handleClick = (toc: TocNode) => {
	triggerHook("TOC_LIST_CLICK", toc);
};
</script>
<template>
	<div v-for="toc in list" :key="toc.id" class="toc">
		<div class="toc-item" @click="handleClick(toc)">{{ toc.text }}</div>
		<TocItem :list="toc.children"></TocItem>
	</div>
</template>
<style lang="less">
.toc {
	.toc {
		padding-left: 20px;
	}

	.toc-item {
		line-height: 1;
		cursor: pointer;
		padding: 8px 10px;
		max-width: 200px;
		border-radius: 3px;

		&:hover {
			background-color: v-bind("themeColors.post.aside.list.activeBgColor");
		}
	}
}
</style>
