<script lang="ts" setup>
import { useContextMenuXY } from "@/composables";
import type { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface";

const emit = defineEmits(["command"]);
const props = defineProps({
	trigger: {
		type: HTMLElement,
		default: null,
	},
	options: {
		type: Array<DropdownMixedOption>,
		default: () => [],
	},
});

const { show, x, y } = useContextMenuXY(props.trigger);
const handleClickoutside = () => (show.value = false);
const handleSelect = (key: any) => {
	show.value = false;
	emit("command", key);
};
</script>
<template>
	<n-dropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="props.options" :show="show" :on-clickoutside="handleClickoutside" @select="handleSelect" />
</template>
