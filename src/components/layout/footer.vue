<script lang="ts" setup>
import { configStore, themeColors } from "@/store";
import { AlertCircle, Sunny, Moon, PlayForward, PlayBack } from "@vicons/ionicons5";
const layoutAboutRef = ref();
const layoutHelpRef = ref();
const size = 16;

const handleChangeTheme = () => {
	configStore.theme = configStore.theme === "light" ? "dark" : "light";
};

const handleCheckHelpNav = (item: any) => {
	if (item === "about") {
		layoutAboutRef.value.show();
	} else if (item === "markdown") {
		layoutHelpRef.value.show();
	}
};

const options = [
	{
		label: "Markdown 语法参考",
		key: "markdown",
	},
	{
		type: "divider",
		key: "d1",
	},
	{
		label: "关于 web-hexo-editor",
		key: "about",
	},
];
</script>
<template>
	<div class="footer">
		<div class="footer-item">
			<StatusButton @click="configStore.layout.isShowLayoutSider = !configStore.layout.isShowLayoutSider">
				<n-icon v-show="configStore.layout.isShowLayoutSider" :size="size">
					<PlayBack />
				</n-icon>
				<n-icon v-show="!configStore.layout.isShowLayoutSider" :size="size">
					<PlayForward />
				</n-icon>
			</StatusButton>
		</div>
		<div class="footer-item">
			<StatusButton>HTTPS://</StatusButton>
		</div>
		<div class="footer-item">
			<StatusButton v-if="configStore.theme !== 'system'" @click="handleChangeTheme">
				<n-icon v-if="configStore.theme === 'light'" :size="size">
					<Moon />
				</n-icon>
				<n-icon v-else :size="size">
					<Sunny />
				</n-icon>
			</StatusButton>
			<n-dropdown trigger="hover" :options="options" @select="handleCheckHelpNav">
				<StatusButton>
					<n-icon :size="size">
						<AlertCircle />
					</n-icon>
				</StatusButton>
			</n-dropdown>
		</div>
	</div>
	<LayoutHelp ref="layoutHelpRef"></LayoutHelp>
	<LayoutAbout ref="layoutAboutRef"></LayoutAbout>
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
	line-height: 1;

	.status-button {
		height: v-bind("configStore.layout.layoutFooterBar");
	}
}
</style>
