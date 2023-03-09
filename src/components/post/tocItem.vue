<script lang="ts" setup>
import { triggerHook } from "@/core/hook";
import { themeColors } from "@/store";

const props = defineProps({
	list: {
		type: Array<TocNode>,
		default: () => [],
	},
	index: {
		type: String,
		default: "",
	},
});

const handleClick = (toc: TocNode) => {
	triggerHook("TOC_LIST_CLICK", toc);
};

const className = computed(() => {
	return "lv-" + props.index.split(".").length;
});
</script>
<template>
	<div v-for="(toc, idx) in list" :key="toc.id" class="toc">
		<div class="toc-item" :class="[className]" @click="handleClick(toc)">
			<span> {{ props.index !== "" ? props.index + (idx + 1) : idx + 1 }}. </span>
			{{ toc.text }}
		</div>
		<TocItem :list="toc.children" :index="(props.index !== '' ? props.index + (idx + 1) : idx + 1) + '.'"></TocItem>
	</div>
</template>
<style lang="less">
.toc {
	.toc-item {
		line-height: 1;
		cursor: pointer;
		padding: 10px;
		border-radius: 3px;

		&:hover {
			background-color: v-bind("themeColors.post.aside.list.activeBgColor");
		}

		&.lv-2 {
			padding-left: 20px;
		}
		&.lv-3 {
			padding-left: 30px;
		}
		&.lv-4 {
			padding-left: 40px;
		}
		&.lv-5 {
			padding-left: 50px;
		}
		&.lv-6 {
			padding-left: 60px;
		}
	}
}
</style>
