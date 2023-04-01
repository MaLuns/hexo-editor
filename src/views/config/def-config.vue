<script lang="ts" setup>
import { styleConfig, editorConfig, otherConfig } from "@/utils/config";
</script>
<template>
	<n-form ref="formRef" label-width="160" label-placement="left" require-mark-placement="right-hanging" :show-feedback="false">
		<n-alert type="warning" style="margin-bottom: 10px">
			{{ $t("config_page.editor_tab.tips") }}
		</n-alert>
		<n-grid :x-gap="12" :y-gap="8" :cols="3">
			<n-grid-item>
				<n-card style="height: 100%">
					<template #header>
						<h4 class="m-0">
							{{ $t("config_page.editor_tab.style") }}
						</h4>
					</template>
					<from-dynamic :config="styleConfig"></from-dynamic>
				</n-card>
			</n-grid-item>
			<n-grid-item>
				<n-card style="height: 100%">
					<template #header>
						<h4 class="m-0">
							{{ $t("config_page.editor_tab.editor") }}
						</h4>
					</template>
					<from-dynamic :config="editorConfig"></from-dynamic>
				</n-card>
			</n-grid-item>
			<n-grid-item>
				<n-card style="height: 100%">
					<template #header>
						<h4 class="m-0">
							{{ $t("config_page.editor_tab.other") }}
						</h4>
					</template>
					<from-dynamic :config="otherConfig"></from-dynamic>
				</n-card>
			</n-grid-item>
		</n-grid>
	</n-form>
</template>
<style lang="less" scoped>
:deep(.n-form-item) {
	margin-bottom: 10px;
}
</style>
