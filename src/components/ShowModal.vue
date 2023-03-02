<script lang="ts" setup>
defineEmits(["update:show"]);
const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: "",
	},
	width: {
		type: String,
		default: "400px",
	},
});

const modalStyle = {
	position: "fixed",
	top: "100px",
	left: 0,
	right: 0,
};
</script>
<template>
	<n-modal :show="props.show" transform-origin="center" :trap-focus="false" @update:show="$emit('update:show', $event)">
		<n-card :style="{ ...modalStyle, width: props.width }" :content-style="{ padding: 0 }">
			<slot name="title">
				<div v-if="props.title" class="title">{{ props.title }}</div>
			</slot>
			<div class="content">
				<slot></slot>
			</div>
		</n-card>
	</n-modal>
</template>
<style lang="less" scoped>
.title {
	height: 40px;
	line-height: 40px;
	padding-left: 10px;
	font-size: 18px;
	font-weight: bold;
}
.content {
	padding: 10px;
}
</style>
