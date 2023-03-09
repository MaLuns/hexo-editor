<script lang="ts" setup>
import { fileStore } from "@/store";
import { ListSharp } from "@vicons/ionicons5";
</script>
<template>
	<n-popover style="max-height: 320px" scrollable :content-style="{ padding: '10px 0' }">
		<template #trigger>
			<n-icon size="24" style="cursor: pointer">
				<list-sharp></list-sharp>
			</n-icon>
		</template>
		<post-toc-item v-if="fileStore.tocs.length" :list="fileStore.tocs"></post-toc-item>
		<div v-else>无目录列表</div>
	</n-popover>
</template>
<style lang="less"></style>
