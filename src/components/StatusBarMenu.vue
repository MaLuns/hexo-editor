<script lang="ts" setup>
import { configStore, themeColors } from "@/store";
import * as statusBar from "@/core/statusBar";
import type { Menu, MenuItem } from "@/core/statusBar";
import { CheckmarkDoneSharp } from "@vicons/ionicons5";

const props = defineProps({
	position: {
		type: String,
		default: "left",
	},
});

const size = 16;
const _list = shallowRef(statusBar.getMenus(props.position as statusBar.Menu["position"]));
const list = computed(() => {
	return _list.value.map((menu) => {
		let titleType = 0;

		if (!menu.title) titleType = 0;
		else if (isRef(menu.title)) titleType = 1;
		else if (typeof menu.title !== "string" && !Object.prototype.hasOwnProperty.call(menu.title, "toString")) titleType = 2;
		else titleType = 3;

		return {
			...menu,
			titleType,
		};
	});
});

const handleItemClick = (item: MenuItem & { type: "normal" }, menu: Menu) => {
	if (item.disabled) {
		return;
	}
	item.onClick && item.onClick(item, menu);
};

const isHas = (val: any): boolean => (isRef(val) ? val.value : val);
</script>
<template>
	<div v-for="item in list" :key="item.id" class="status-button" :title="item.tips" @click="item.onClick && item.onClick(item)" @mousedown="item.onMousedown && item.onMousedown(item)">
		<n-icon v-if="item.icon" :size="size" :component="item.icon"></n-icon>
		<div v-if="item.titleType !== 0" class="status-button__title">
			<template v-if="item.titleType === 1">
				{{ (item.title as Ref).value }}
			</template>
			<template v-else-if="item.titleType === 2">
				<component :is="item.title"></component>
			</template>
			<template v-else>
				{{ item.title }}
			</template>
		</div>
		<template v-if="item.list && item.list.length">
			<ul class="list" :class="{[props.position]:props.position,'has-checked': item.list.some((x: any) => x.type === 'normal' && x.checked)}">
				<template v-for="(menuItem, index) in item.list" :key="index">
					<li v-if="menuItem.type === 'separator'" class="separator"></li>
					<li v-else class="list-item" @click="handleItemClick(menuItem, item)">
						<n-icon v-if="isHas(menuItem.checked)" class="checked-icon" size="14">
							<CheckmarkDoneSharp />
						</n-icon>
						<div class="list-item__title">{{ menuItem.title }}</div>
						<div v-if="menuItem.subTitle" class="list-item__sub-title">
							{{ menuItem.subTitle }}
						</div>
					</li>
				</template>
			</ul>
		</template>
	</div>
</template>
<style lang="less" scoped>
.status-button {
	cursor: pointer;
	position: relative;
	padding: 0 6px;
	height: 100%;
	margin: 0 2px;
	display: flex;
	align-items: center;

	.n-icon + &__title {
		margin-left: 4px;
	}

	.list {
		border-radius: 4px 4px 0 0;
		position: absolute;
		bottom: v-bind("configStore.layout.layoutFooterBar");
		list-style: none;
		padding: 6px 0;
		margin: 0;
		background-color: v-bind("themeColors.footer.bgColor");
		width: max-content;
		line-height: 2;
		min-width: 70px;
		display: none;
		left: 0;

		/* &.left {
			left: 0;
		}

		&.right {
			right: 0;
		} */

		&.has-checked {
			.list-item {
				padding: 0 12px 0 28px;
			}
		}

		.separator {
			height: 1px;
			padding: 0 10px;
			margin: 4px 0;
			background-color: #ededf580;
		}

		&-item {
			padding: 4px 12px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&__sub-title {
				opacity: 0.8;
				margin-left: 12px;
			}

			&:hover {
				background: #0a0a0a56;
			}
		}

		.checked-icon {
			position: absolute;
			left: 8px;
		}
	}

	&:hover {
		background: #ffffff1f;
		.list {
			display: block;
		}
	}
}
</style>
