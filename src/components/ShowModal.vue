<script lang="ts" setup>
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
		<n-card :title="title" :style="{ ...modalStyle, width: props.width }">
			<slot></slot>
		</n-card>
	</n-modal>
</template>
