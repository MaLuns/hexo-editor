<script lang="ts" setup>
import { configStore } from "@/store";
</script>
<template>
	<div class="layout">
		<div class="layout-main-container">
			<div v-if="configStore.layout.isShowLayoutSider" class="layout-sider">
				<LayoutSider></LayoutSider>
			</div>
			<div class="layout-main">
				<router-view v-slot="{ Component }">
					<keep-alive>
						<component :is="Component" />
					</keep-alive>
				</router-view>
			</div>
		</div>
		<div class="layout-footer-container">
			<LayoutFooter></LayoutFooter>
		</div>
	</div>
</template>
<style lang="less" scoped>
.layout {
	display: flex;
	height: 100vh;
	overflow: hidden;
	flex-direction: column;

	.layout-main-container {
		display: flex;
		flex: 1;
		flex-shrink: 0;
		overflow: hidden;

		.layout-sider {
			width: v-bind("configStore.layout.layoutSiderWidth");
			flex-shrink: 0;
			box-sizing: border-box;
		}

		.layout-main {
			flex: 1;
			overflow: hidden;
		}
	}

	.layout-footer-container {
		height: v-bind("configStore.layout.layoutFooterBar");
		flex-shrink: 0;
	}
}
</style>
