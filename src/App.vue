<script lang="ts" setup>
import { zhCN, dateZhCN, type GlobalThemeOverrides } from "naive-ui";
import { themeMode } from "@/store";
const light: GlobalThemeOverrides = {
	common: {
		primaryColor: "#7018A0FF",
		primaryColorHover: "#8850C8AA",
		primaryColorPressed: "#590C7AFF",
		primaryColorSuppl: "#8D36ADFF",
	},
};

const dark: GlobalThemeOverrides = {
	common: {
		primaryColor: "#8F63E2FF",
		primaryColorHover: "#A77FE7FF",
		primaryColorPressed: "#9C5ACEFF",
		primaryColorSuppl: "rgba(83, 42, 148, 1)",
	},
};
</script>
<template>
	<n-config-provider :theme="themeMode" :theme-overrides="themeMode ? dark : light" :locale="zhCN" :date-locale="dateZhCN">
		<n-dialog-provider>
			<n-message-provider>
				<n-notification-provider placement="bottom-right">
					<RouterView />
				</n-notification-provider>
			</n-message-provider>
		</n-dialog-provider>
		<n-global-style />
	</n-config-provider>
</template>
