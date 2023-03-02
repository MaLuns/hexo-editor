<template>
	<div class="status-button">
		<slot></slot>
	</div>
</template>
<style lang="less" scoped>
.status-button {
	padding: 0 6px;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	height: 100%;

	&:hover {
		background: #ffffff1f;
	}
}
</style>
