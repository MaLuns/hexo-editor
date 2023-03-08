<script lang="ts" setup>
import { fileStore } from "@/store";
import { ListSharp } from "@vicons/ionicons5";
</script>
<template>
	<n-popover style="max-height: 320px" scrollable>
		<template #trigger>
			<n-icon size="24" style="cursor: pointer">
				<ListSharp></ListSharp>
			</n-icon>
		</template>
		<PostTocItem v-if="fileStore.tocs.length" :list="fileStore.tocs"></PostTocItem>
		<div v-else>无目录列表</div>
	</n-popover>
</template>
<style lang="less"></style>
