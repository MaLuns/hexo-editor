<script lang="ts" setup>
import { themmStore } from "@/store";
</script>
<template>
	<div class="layout">
		<div class="layout-sider">
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
</template>
<style lang="less" scoped>
.layout {
	display: flex;
	height: 100vh;
	overflow: hidden;

	.layout-sider {
		width: v-bind("themmStore.config.layoutSiderWidth");
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.layout-main {
		flex: 1;
		overflow: hidden;
	}
}
</style>
