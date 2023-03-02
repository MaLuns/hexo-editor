<script lang="ts" setup>
import { zhCN, dateZhCN, type GlobalThemeOverrides } from "naive-ui";
import { themeMode } from "@/store";
const light: GlobalThemeOverrides = {
	common: {
		primaryColor: "#7018A0FF",
		primaryColorHover: "#8850C8FF",
		primaryColorPressed: "#590C7AFF",
		primaryColorSuppl: "#8D36ADFF",
	},
};

const dark: GlobalThemeOverrides = {
	common: {
		primaryColor: "#C84FEDFF",
		primaryColorHover: "#9E5EE8FF",
		primaryColorPressed: "#9D2AE4FF",
		primaryColorSuppl: "#B658F9FF",
	},
};
</script>
<template>
	<n-config-provider :theme="themeMode" :theme-overrides="themeMode ? dark : light" :locale="zhCN" :date-locale="dateZhCN">
		<n-dialog-provider>
			<n-message-provider>
				<RouterView />
			</n-message-provider>
		</n-dialog-provider>
		<n-global-style />
	</n-config-provider>
</template>
