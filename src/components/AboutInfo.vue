<script lang="ts" setup>
import { author, version, homepage } from "../../package.json";
import { t } from "@/i18n";
</script>
<template>
	<div>
		<img src="../assets/logo.svg" class="logo" alt="logo" width="80" />
		<div class="text">
			<h3>{{ t("about.title") }}</h3>
			<p>
				<n-button text tag="a" :href="homepage" target="_blank">Gitee</n-button>
				<n-divider vertical></n-divider>
				<n-button text tag="a" :href="homepage" target="_blank">Github</n-button>
				<n-divider vertical></n-divider>
				<n-button text>{{ version }}</n-button>
			</p>
			<p>
				{{ t("about.copy_right") }}
				<n-button text tag="a" :href="author.url" target="_blank">{{ author.name }}</n-button>
			</p>
		</div>
	</div>
</template>
