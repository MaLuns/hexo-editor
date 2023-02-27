<script lang="ts" setup>
import { EyeSharp, EyeOffSharp, ListSharp, ColorPaletteSharp } from "@vicons/ionicons5";
import { switchTheme } from "@/utils/editor";
import themelist from "@/utils/editor/themes/themelist.json";

const themes: { label: any; value: string }[] = [];
for (const key in themelist) {
	if (Object.prototype.hasOwnProperty.call(themelist, key)) {
		const element = themelist[key as keyof typeof themelist];
		themes.push({
			label: element,
			value: key,
		});
	}
}

const hOptions = [
	{ label: "一级标题", value: "#" },
	{ label: "二级标题", value: "##" },
	{ label: "三级标题", value: "###" },
	{ label: "四级标题", value: "####" },
	{ label: "五级标题", value: "#####" },
];

const props = defineProps({
	preview: {
		type: Boolean,
		default: true,
	},
});

const handleSwitchTheme = (key: string) => {
	switchTheme(key);
};
</script>
<template>
	<n-space :item-style="{ alignItems: 'center', display: 'flex' }">
		<n-popselect :options="hOptions">
			<n-icon size="22">
				<ListSharp />
			</n-icon>
		</n-popselect>
	</n-space>
	<n-space :item-style="{ alignItems: 'center', display: 'flex' }">
		<n-icon size="22">
			<EyeSharp v-if="props.preview" />
			<EyeOffSharp v-else />
		</n-icon>
		<n-popselect :options="themes" scrollable @change="handleSwitchTheme">
			<n-icon size="22">
				<ColorPaletteSharp />
			</n-icon>
		</n-popselect>
	</n-space>
</template>
<style scoped lang="less">
.n-icon {
	transition: color 0.3s;
	cursor: pointer;

	&:hover {
		color: #8c63ca;
	}
}
</style>
