<script lang="ts" setup>
import { ListSharp } from "@vicons/ionicons5";
import { Pinned } from "@vicons/tabler";

interface Props {
	list: TocNode[];
}

defineProps<Props>();

const showPopover = ref(false);
const isFix = ref(false);

const toggleShow = () => {
	if (isFix.value) return;
	showPopover.value = !showPopover.value;
};

const toggleFix = () => {
	isFix.value = !isFix.value;
};
</script>
<template>
	<n-popover style="max-height: 320px; min-width: 200px" scrollable :content-style="{ padding: '10px 0' }" :show="showPopover" :on-clickoutside="toggleShow">
		<template #trigger>
			<n-icon size="20" style="cursor: pointer" @click="toggleShow">
				<list-sharp></list-sharp>
			</n-icon>
		</template>
		<div style="position: absolute; height: 40px; background-color: var(--n-color); top: 0; width: 100%; line-height: 40px; padding: 0 10px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center">
			<div style="font-weight: bold">{{ $t("post.toc") }}</div>
			<n-avatar round size="small" style="cursor: pointer">
				<n-icon size="20" :style="{ transform: isFix ? 'rotate(0deg)' : 'rotate(45deg)', transition: 'transform 0.1s' }" @click="toggleFix">
					<Pinned></Pinned>
				</n-icon>
			</n-avatar>
		</div>
		<div style="margin-top: 30px">
			<post-toc-item v-if="$props.list.length" :list="$props.list"></post-toc-item>
			<div v-else style="padding: 10px 10px 0">{{ $t("post.toc_empty") }}</div>
		</div>
	</n-popover>
</template>
<style lang="less"></style>
