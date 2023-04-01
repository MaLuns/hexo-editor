<script lang="ts" setup>
import DefConfig from "./def-config.vue";
import HexoConfig from "./hexo-config.vue";
</script>
<template>
	<div class="config-page">
		<n-tabs type="segment" :bar-width="28">
			<n-tab-pane class="tab-pane" name="chap1" :tab="$t('config_page.editor_tab.label')" display-directive="show:lazy">
				<n-scrollbar>
					<def-config></def-config>
				</n-scrollbar>
			</n-tab-pane>
			<n-tab-pane class="tab-pane" name="chap2" :tab="$t('config_page.hexo_tab.label')" display-directive="show:lazy">
				<hexo-config></hexo-config>
			</n-tab-pane>
		</n-tabs>
	</div>
</template>
<style lang="less" scoped>
.config-page {
	padding: 10px;
	height: 100%;
	box-sizing: border-box;
	.n-tabs {
		height: 100%;
	}

	.n-tab-pane {
		height: calc(100% - 50px);
	}
}
</style>
