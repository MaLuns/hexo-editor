<script lang="ts" setup>
import { useThemeVars } from "naive-ui";
interface Props {
	keybinds: {
		title: string;
		keybindLabel: string[];
	}[];
	mds: {
		label: string;
		value: string;
	}[];
}
defineProps<Props>();
const themeVars = useThemeVars();
const containerRef = ref();
</script>
<template>
	<n-scrollbar ref="containerRef" class="custom-scorll" style="max-height: 450px">
		<h3 class="center">Keybinds 快捷键</h3>
		<ul class="help-info">
			<li v-for="(item, index) in $props.keybinds" :key="index">
				<div>{{ item.title }}</div>
				<div class="keybind-label">
					<kbd v-for="key in item.keybindLabel" :key="key" class="command-palette-commands-key">
						{{ key }}
					</kbd>
				</div>
			</li>
		</ul>
		<h3 class="center">Markdown 语法参考</h3>
		<ul class="help-info">
			<li v-for="(item, index) in $props.mds" :key="index">
				<div>{{ item.label }}</div>
				<div class="md-value">{{ item.value.replace(/(^\n)|\n$/, "") }}</div>
			</li>
		</ul>
	</n-scrollbar>
</template>
<style lang="less" scoped>
.help-info {
	list-style: none;
	margin: 10px 0;
	padding: 0;

	li {
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 10px;
		border-top: 1px solid v-bind("themeVars.borderColor");
		border-left: 1px solid v-bind("themeVars.borderColor");
		border-right: 1px solid v-bind("themeVars.borderColor");

		&:first-child {
			border-radius: 3px 3px 0 0;
		}

		&:last-child {
			border-bottom: 1px solid v-bind("themeVars.borderColor");
			border-radius: 0 0 3px 3px;
		}

		.md-value,
		.keybind-label {
			width: 50%;
			white-space: pre-wrap;
			padding-left: 20px;
			border-left: 1px solid v-bind("themeVars.borderColor");
		}

		.keybind-label {
			display: flex;
		}
	}
}

.command-palette-commands-key {
	align-items: center;
	background: v-bind("themeVars.tagColor");
	border-radius: 2px;
	line-height: 18px;
	font-weight: bolder;
	margin-left: 0.3em;
	padding: 4px 6px;
	border: 0;
}
</style>
