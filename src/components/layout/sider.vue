<script lang="ts" setup>
import type { TooltipProps } from "naive-ui";
import { siderPage } from "@/router";
import { themeColors } from "@/store";

const router = useRouter();
const data = reactive({
	active: 0,
	pageNavs: siderPage.map((item) => {
		return {
			name: item.name as string,
			icon: item?.meta?.icon as Component,
			tips: item?.meta?.tips as string,
		};
	}),
});

const handleCheckNav = (index: number) => {
	data.active = index;
	let nav = data.pageNavs[index];
	if (nav.name) {
		router.push({
			name: nav.name,
		});
	}
};

type TooltipThemeOverrides = NonNullable<TooltipProps["themeOverrides"]>;
const tooltipThemeOverrides: TooltipThemeOverrides = {
	peers: {
		Popover: {
			spaceArrow: "22px",
		},
	},
};
</script>
<template>
	<div class="layout-sider">
		<ul class="layout-sider__item">
			<li v-for="(item, index) in data.pageNavs" :key="index" class="layout-sider__item-nav" :class="{ active: data.active === index }" @click="handleCheckNav(index)">
				<n-tooltip placement="right" trigger="hover" :theme-overrides="tooltipThemeOverrides">
					<template #trigger>
						<n-icon size="26" :component="item.icon"> </n-icon>
					</template>
					{{ item.tips }}
				</n-tooltip>
			</li>
		</ul>
	</div>
</template>
<style lang="less" scoped>
.layout-sider {
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: space-between;
	background-color: v-bind("themeColors.sider.bgColor");
}

.layout-sider__item {
	list-style: none;
	padding: 0;
	margin: 0;

	&-nav {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 56px;
		cursor: pointer;
		color: v-bind("themeColors.sider.iconColor");
		transition: color 0.3s;

		&.active {
			color: v-bind("themeColors.sider.iconActiveColor");

			&::after {
				position: absolute;
				content: "";
				width: 4px;
				background-color: v-bind("themeColors.sider.iconActiveColor");
				height: 80%;
				left: 0;
			}
		}

		&:hover {
			color: v-bind("themeColors.sider.iconActiveColor");
		}
	}
}
</style>
