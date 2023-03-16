<script lang="ts" setup>
interface Props {
	type: "horizontal" | "vertical";
	leftHide?: boolean;
	rightHide?: boolean;
}
const props = defineProps<Props>();

const triggerRef = ref<HTMLElement>();
const splitRef = ref<HTMLElement>();
const splitRatio = ref(50); // 分割比例
const triggerWidth = 8;
let triggerOffset = 0;

const leftPaneStyle = computed(() => {
	if (props.type === "horizontal") {
		return {
			right: 100 - splitRatio.value + "%",
		};
	} else {
		return {
			bottom: 100 - splitRatio.value + "%",
		};
	}
});

const rightPaneStyle = computed(() => {
	if (props.type === "horizontal") {
		return {
			left: splitRatio.value + "%",
		};
	} else {
		return {
			top: splitRatio.value + "%",
		};
	}
});

const triggerStyle = computed(() => {
	if (props.type === "horizontal") {
		return {
			width: triggerWidth + "px",
			left: splitRatio.value + "%",
		};
	} else {
		return {
			height: triggerWidth + "px",
			top: splitRatio.value + "%",
		};
	}
});

// 移动
const handleMouseMove = (e: MouseEvent) => {
	const clientRect = splitRef.value!.getBoundingClientRect();
	let paneLengthPercent = 0;

	if (props.type === "horizontal") {
		const offset = e.pageX - clientRect.left - triggerOffset + triggerWidth / 2;
		paneLengthPercent = (offset / clientRect.width) * 100;
	} else {
		const offset = e.pageY - clientRect.top - triggerOffset + triggerWidth / 2;
		paneLengthPercent = (offset / clientRect.height) * 100;
	}

	splitRatio.value = Math.min(Math.max(paneLengthPercent, 0), 100);
};

// 松开滑动
const handleMouseUp = () => {
	document.removeEventListener("mousemove", handleMouseMove);
	document.removeEventListener("mouseup", handleMouseUp);
};

const handleMouseDown = (e: MouseEvent) => {
	document.addEventListener("mousemove", handleMouseMove);
	document.addEventListener("mouseup", handleMouseUp);

	if (props.type === "horizontal") {
		triggerOffset = e.pageX - (e.target as HTMLElement).getBoundingClientRect().left;
	} else {
		triggerOffset = e.pageY - (e.target as HTMLElement).getBoundingClientRect().top;
	}
};
</script>
<template>
	<div ref="splitRef" class="split-wrapper" :class="$props.type">
		<div v-show="!$props.leftHide" class="split-pane left-pane" :class="{ force: $props.rightHide }" :style="leftPaneStyle">
			<slot name="left"></slot>
		</div>
		<div v-if="!$props.leftHide && !$props.rightHide" ref="triggerRef" class="split-trigger" :style="triggerStyle" @mousedown="handleMouseDown">
			<div class="split-line"></div>
		</div>
		<div v-show="!$props.rightHide" class="split-pane right-pane" :class="{ force: $props.leftHide }" :style="rightPaneStyle">
			<slot name="right"></slot>
		</div>
	</div>
</template>
<style lang="less" scoped>
.split-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;

	.split-pane {
		position: absolute;

		&.left-pane {
			right: 50%;
			left: 0;
		}

		&.right-pane {
			right: 0;
			left: 50%;
		}

		&.left-pane,
		&.right-pane {
			top: 0;
			bottom: 0;
		}

		&.force {
			position: static;
			width: 100%;
			height: 100%;
		}
	}

	.split-trigger {
		cursor: col-resize;
		position: absolute;
		left: 50%;
		z-index: 1;
		height: 100%;
		width: 8px;
		margin-left: -4px;
		user-select: none;
		.split-line {
			transition: opacity 0.1s ease-out;
			margin-left: 1px;
			width: 6px;
			height: 100%;
			background-color: #5f71db;
			opacity: 0;
		}

		&:hover {
			.split-line {
				opacity: 1;
				transition-delay: 60ms;
			}
		}
	}

	&.vertical {
		.split-pane {
			.left-pane {
				top: 0;
				bottom: 50%;
			}
			.right-pane {
				top: 50%;
				bottom: 0;
			}

			.left-pane,
			.right-pane {
				left: 0;
				right: 0;
			}
		}

		.split-trigger {
			cursor: row-resize;
			width: 100%;
			height: 8px;
			position: absolute;
			top: 50%;
			left: 0;
			right: 0;
			margin-left: 0;
			margin-top: -4px;

			.split-line {
				margin-left: 0;
				margin-top: 1px;
				height: 6px;
				width: 100%;
			}
		}
	}
}
</style>
