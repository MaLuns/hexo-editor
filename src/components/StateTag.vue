<script lang="ts" setup>
interface Props {
	state?: "success" | "warning" | "error" | "info";
}
defineProps<Props>();
</script>
<template>
	<span class="state-tag" :class="state"></span>
</template>
<style lang="less" scoped>
.state-tag {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;

	&.success {
		background-color: #18a058;
	}
	&.warning {
		background-color: #f0a020;
	}
	&.error {
		background-color: #d03050;
	}
	&.info {
		background-color: #2080f0;
	}
}
</style>
