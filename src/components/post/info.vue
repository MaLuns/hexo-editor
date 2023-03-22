<script lang="ts" setup>
import { fileStore } from "@/store";
import { FileCode, DeviceFloppy } from "@vicons/tabler";
defineEmits(["save"]);

const datetime = computed({
	get: () => {
		return fileStore.post?.date.getTime();
	},
	set: (val) => {
		if (fileStore.post?.date && val) {
			fileStore.post.date = new Date(val);
		}
	},
});
</script>
<template>
	<n-popover scrollable placement="bottom-end" :width="300">
		<template #trigger>
			<n-icon size="20" style="cursor: pointer">
				<file-code></file-code>
			</n-icon>
		</template>
		<div v-if="fileStore.post">
			<n-form label-placement="left" label-width="auto" :show-feedback="false">
				<n-form-item label="文章标题">
					<n-input v-model:value="fileStore.post.title"></n-input>
				</n-form-item>
				<n-form-item label="创建日期">
					<n-date-picker v-model:value="datetime" type="datetime" style="width: 100%"></n-date-picker>
				</n-form-item>
				<n-form-item label="描述">
					<n-input v-model:value="fileStore.post.frontmatter.description"></n-input>
				</n-form-item>
				<n-form-item label="分类">
					<n-dynamic-tags v-model:value="fileStore.post.frontmatter.categories" />
				</n-form-item>
				<n-form-item label="标签">
					<n-dynamic-tags v-model:value="fileStore.post.frontmatter.tags" :color="{}" />
				</n-form-item>
				<div style="display: flex; justify-content: center">
					<n-button strong secondary type="success" style="width: 100%" @click="$emit('save')">
						<template #icon>
							<n-icon>
								<DeviceFloppy />
							</n-icon>
						</template>
						保存
					</n-button>
				</div>
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
