<script lang="ts" setup>
import { useAutoScroll } from "@/composables";
import { themeColors } from "@/store";
import { Close } from "@vicons/ionicons5";
import { NIcon } from "naive-ui";
import type { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface";

const emit = defineEmits(["update:modelValue", "close"]);
const postTabsRef = ref<HTMLElement>();

const options: DropdownMixedOption[] = [
	{
		label: "关闭",
		key: "close",
	},
	{
		label: "关闭其他",
		key: "other",
	},
	{
		label: "关闭已保存",
		key: "save",
	},
	{
		label: "全部关闭",
		key: "all",
	},
];

const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	list: {
		type: Array<LabelVal & { state: number }>,
		default: () => [],
	},
});

let currentTab: LabelVal | null = null;
const handleMouseenter = (tab: LabelVal) => (currentTab = tab);
const handleCommand = (key: string) => {
	if (currentTab) {
		emit("close", key, currentTab.value);
	}
};

onMounted(() => {
	const { scrollTo } = useAutoScroll(postTabsRef.value!, "x");
	watchEffect(() => {
		if (props.modelValue) {
			nextTick(() => {
				scrollTo(".post-tabs__tab-wrapper.active");
			});
		}
	});
});
</script>
<template>
	<div class="post-tabs">
		<div v-if="$slots.prefix" class="post-tabs__prefix">
			<slot name="prefix"></slot>
		</div>
		<div class="post-tabs__scroll-content">
			<div ref="postTabsRef" class="post-tabs__wrapper">
				<div v-for="(item, index) in props.list" :key="`${item.value}_${index}`" class="post-tabs__tab-wrapper" :class="{ active: item.value === props.modelValue }" @mouseenter="handleMouseenter(item)" @click="$emit('update:modelValue', item.value)">
					<div class="post-tabs__tab-label">
						<slot name="tab" v-bind="item">{{ item.label }} </slot>
					</div>
					<div class="opt__wrapper">
						<span v-if="item.state === 1" class="save-tag"></span>
						<n-button class="close-btn" quaternary size="tiny" @click.stop="$emit('close', 'close', item.value)">
							<template #icon>
								<n-icon>
									<Close />
								</n-icon>
							</template>
						</n-button>
					</div>
				</div>
			</div>
			<div class="post-tabs__pad"></div>
		</div>
		<div v-if="$slots.suffix" class="post-tabs__suffix">
			<slot name="suffix"></slot>
		</div>
	</div>
	<ContextMenu v-if="postTabsRef" :trigger="postTabsRef" :options="options" @command="handleCommand"></ContextMenu>
</template>
<style lang="less" scoped>
.post-tabs {
	display: flex;
	height: 100%;
	width: 100%;
	max-height: 50px;
	user-select: none;

	.post-tabs__prefix,
	.post-tabs__suffix {
		padding: 0 10px;
		display: flex;
		align-items: center;
	}

	.post-tabs__scroll-content {
		flex: 1;
		display: flex;
		overflow: hidden;

		.post-tabs__wrapper {
			transition: transform 0.2s;
			display: flex;

			.opt__wrapper {
				width: 30px;
				display: flex;
				justify-content: center;

				.save-tag + .close-btn {
					display: none;
				}

				&:hover {
					.save-tag {
						display: none;
					}
					.close-btn {
						display: inline-flex;
					}
				}
			}
			.post-tabs__tab-wrapper {
				cursor: pointer;
				display: flex;
				padding: 0 2px 0 10px;
				align-items: center;
				white-space: nowrap;
				background-color: v-bind("themeColors.post.tabs.tabBgColor");
				color: v-bind("themeColors.post.tabs.tabColor");

				.close-btn {
					visibility: hidden;
				}

				& + .post-tabs__tab-wrapper {
					border-left: 1px solid v-bind("themeColors.post.tabs.panBgColor");
				}

				&:hover {
					.close-btn {
						visibility: visible;
					}
				}

				&.active {
					background-color: #0000;

					.close-btn {
						visibility: visible;
					}
				}

				.post-tabs__tab-label {
					margin-right: 6px;
				}
			}
		}

		.post-tabs__pad {
			flex-grow: 1;
			background-color: v-bind("themeColors.post.tabs.panBgColor");
		}
	}

	.save-tag {
		display: inline-block;
		width: 10px;
		height: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #e2bf5d;
		border-radius: 50%;
	}
}
</style>
