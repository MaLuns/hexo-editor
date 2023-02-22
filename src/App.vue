<script lang="ts" setup>
import { zhCN, dateZhCN } from "naive-ui";
import { themmStore } from "@/store";
</script>
<template>
	<n-config-provider :theme="themmStore.mode" :locale="zhCN" :date-locale="dateZhCN">
		<n-dialog-provider>
			<n-message-provider>
				<RouterView />
			</n-message-provider>
		</n-dialog-provider>
	</n-config-provider>
</template>
