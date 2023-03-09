<script lang="ts" setup>
import { configStore, themeColors } from "@/store";
</script>
<template>
	<div class="footer" @contextmenu.prevent>
		<div class="footer-item">
			<status-bar-menu position="left"></status-bar-menu>
		</div>
		<div class="footer-item">
			<status-bar-menu position="center"></status-bar-menu>
		</div>
		<div class="footer-item">
			<status-bar-menu position="right"></status-bar-menu>
		</div>
	</div>
</template>
<style lang="less" scoped>
.footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: v-bind("configStore.layout.layoutFooterBar");
	font-size: 12px;
	user-select: none;
	background-color: v-bind("themeColors.footer.bgColor");
	color: v-bind("themeColors.footer.color");
	box-sizing: border-box;
	padding: 0 4px;
	line-height: 1;

	.footer-item {
		height: v-bind("configStore.layout.layoutFooterBar");
		display: flex;
		align-items: center;
	}
}
</style>
