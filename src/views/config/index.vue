<script lang="ts" setup>
import DefConfig from "./defConfig.vue";
</script>
<template>
	<div style="padding: 10px">
		<n-tabs type="segment" :bar-width="28">
			<n-tab-pane class="tab-pane" name="chap1" tab="常用配置">
				<DefConfig></DefConfig>
			</n-tab-pane>
			<n-tab-pane class="tab-pane" name="chap2" tab="Hexo 配置">
				<EditorMonaco></EditorMonaco>
			</n-tab-pane>
			<n-tab-pane class="tab-pane" name="chap3" tab="主题配置">
				<div style="height: 500px">
					<EditorMonaco language="yaml"></EditorMonaco>
				</div>
			</n-tab-pane>
		</n-tabs>
	</div>
</template>
<!-- <style lang="less" scoped>
.tab-pane {
	padding: 0;
}
</style> -->
