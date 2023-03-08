<template>
	<n-form ref="formRef" label-width="120" label-placement="left" require-mark-placement="right-hanging" :show-feedback="false">
		<n-grid :x-gap="12" :y-gap="8" :cols="3">
			<n-grid-item>
				<n-card style="height: 100%">
					<template #header> <h4 class="m-0">外观</h4> </template>
					<n-form-item label="主题" path="theme">
						<n-select v-model:value="configStore.theme" :options="themeOptions" class="w-100" />
					</n-form-item>
					<n-form-item label="语言" path="language">
						<n-select v-model:value="configStore.language" :options="languageOptions" class="w-100" />
					</n-form-item>
					<n-form-item label="编辑器主题(亮)" path="date">
						<n-select v-model:value="configStore.editorLightTheme" :options="themes[0]" class="w-200" @on-update:value="loadEditorTheme('light', $event)" />
					</n-form-item>
					<n-form-item label="编辑器主题(暗)" path="date">
						<n-select v-model:value="configStore.editorDartTheme" :options="themes[1]" class="w-200" @on-update:value="loadEditorTheme('dark', $event)" />
					</n-form-item>
					<n-form-item label="自定义样式" path="preStyle">
						<n-input v-model:value="configStore.preStyle" type="textarea" placeholder="自定义主题样式" />
					</n-form-item>
				</n-card>
			</n-grid-item>
			<n-grid-item>
				<n-card style="height: 100%">
					<template #header> <h4 class="m-0">编辑器</h4> </template>
					<n-form-item label="行号" path="lineNumbers">
						<n-select v-model:value="configStore.editorOption.lineNumbers" :options="lineNumberOptions" class="w-100" />
					</n-form-item>
					<n-form-item label="自动保存" path="autoSave">
						<n-select v-model:value="configStore.autoSave" :options="timeOptions" class="w-100" />
					</n-form-item>
					<n-form-item label="自动渲染" path="autoRender">
						<n-select v-model:value="configStore.autoRender" :options="timeOptions" class="w-100" />
					</n-form-item>
					<n-form-item label="显示小地图" path="minimap">
						<n-switch v-model:value="configStore.editorOption.minimap.enabled" />
					</n-form-item>
					<n-form-item label="小地图样式" path="minimap">
						<n-switch v-model:value="configStore.editorOption.minimap.renderCharacters">
							<template #checked> 显示文字 </template>
							<template #unchecked> 显示块 </template>
						</n-switch>
					</n-form-item>
					<n-form-item label="换行显示" path="wordWrap">
						<n-select v-model:value="configStore.editorOption.wordWrap" :options="wordWrapOptions" class="w-100" />
					</n-form-item>
					<n-form-item label="鼠标滚轮缩放" path="date">
						<n-switch v-model:value="configStore.editorOption.mouseWheelZoom" />
					</n-form-item>
					<n-form-item label="字体大小" path="fontSize">
						<n-slider v-model:value="configStore.editorOption.fontSize" :step="2" :min="12" :max="30" />
					</n-form-item>
					<n-form-item label="字体" path="font">
						<n-input v-model:value="configStore.editorOption.fontFamily" placeholder="e.g., 'Courier New', monospace"></n-input>
					</n-form-item>
				</n-card>
			</n-grid-item>
			<n-grid-item>
				<n-card style="height: 100%">
					<template #header> <h4 class="m-0">其他</h4> </template>
					<n-form-item label="Front-Matter" path="date">
						<n-switch v-model:value="configStore.hideFrontMatter">
							<template #checked> 隐藏 Front-Matter </template>
							<template #unchecked> 显示 Front-Matter </template>
						</n-switch>
					</n-form-item>
					<n-form-item label="图片存放目录" path="imgStorageDir">
						<n-input v-model:value="configStore.imgStorageDir" />
					</n-form-item>
					<!-- <n-form-item label="图床" path="date">
						<n-switch />
					</n-form-item> -->
				</n-card>
			</n-grid-item>
		</n-grid>
	</n-form>
</template>

<script lang="ts" setup>
import { themes, loadEditorTheme } from "@/utils/editor";
import { configStore } from "@/store";

const themeOptions = [
	{ label: "亮白", value: "light" },
	{ label: "暗黑", value: "dark" },
	{ label: "跟随系统", value: "system" },
];

const languageOptions = [
	{ label: "中文", value: "zh_cn" },
	{ label: "English", value: "en" },
];

const lineNumberOptions = [
	{ label: "On", value: "on" },
	{ label: "Off", value: "off" },
	{ label: "Relative", value: "relative" },
	{ label: "Interval", value: "interval" },
];

const wordWrapOptions = [
	{ label: "On", value: "on" },
	{ label: "Off", value: "off" },
	{ label: "WordWrapColumn", value: "wordWrapColumn" },
	{ label: "Bounded", value: "bounded" },
];

const timeOptions = [
	{ label: "关闭", value: 0 },
	{ label: "0.5s", value: 500 },
	{ label: "2s", value: 2000 },
	{ label: "4s", value: 4000 },
	{ label: "8s", value: 8000 },
	{ label: "30s", value: 30000 },
	{ label: "60s", value: 60000 },
];
</script>
<style lang="less" scoped>
.n-form-item {
	margin-bottom: 10px;
}
</style>
