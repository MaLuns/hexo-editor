<script lang="ts" setup>
import { fileStore } from "@/store";
import { FileCode } from "@vicons/tabler";
</script>
<template>
	<n-popover scrollable placement="bottom-end">
		<template #trigger>
			<n-icon size="22" style="cursor: pointer">
				<file-code></file-code>
			</n-icon>
		</template>
		<div v-if="fileStore.post">
			<n-form size="small" label-placement="left" require-mark-placement="right-hanging" :show-feedback="false">
				<n-form-item label="标题">
					<n-input v-model:value="fileStore.post.title"></n-input>
				</n-form-item>
				<n-form-item label="日期">
					<n-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></n-date-picker>
				</n-form-item>
				<n-form-item label="描述">
					<n-input v-model:value="fileStore.post.frontmatter.description"></n-input>
				</n-form-item>
				<n-form-item label="分类">
					<n-input v-model:value="fileStore.post.frontmatter.categories"></n-input>
				</n-form-item>
				<n-form-item label="标签">
					<n-input v-model:value="fileStore.post.frontmatter.tags"></n-input>
				</n-form-item>
			</n-form>
		</div>
		<div v-else>未找到文件信息</div>
	</n-popover>
</template>
<style lang="less" scoped>
.n-form-item {
	margin-bottom: 10px;
}
</style>
