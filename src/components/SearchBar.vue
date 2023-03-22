<script lang="ts" setup>
import type { InputInst } from "naive-ui";

const inputInstRef = ref<InputInst | null>(null);
const show = ref<boolean>(false);
const open = () => {
	show.value = true;
	inputInstRef.value?.focus();
};

const close = () => {
	show.value = false;
};

const toggle = () => {
	show.value = !show.value;
};

provide("search-bar", {
	open,
	close,
	toggle,
});
</script>
<template>
	<slot></slot>
	<Teleport to="body">
		<div v-if="show" class="search-bar">
			<div class="search-mark"></div>
			<div class="search-content">
				<n-input ref="inputInstRef" size="large" placeholder="大" />
			</div>
		</div>
	</Teleport>
</template>
<style lang="less" scoped>
.search-content {
	position: fixed;
	top: 100px;
	left: 0;
	right: 0;
	margin: 0 auto;
	width: 50%;
	max-height: 500px;
	background-color: #000;
	box-shadow: 0 0 20px 0 #ffffff2c;
	z-index: 999;
}
.search-mark {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: #000000b2;
}
</style>
