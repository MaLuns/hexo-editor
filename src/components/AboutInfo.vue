<script lang="ts" setup>
import { author, version, homepage } from "../../package.json";
</script>
<template>
	<div>
		<img src="../assets/logo.svg" class="logo" alt="logo" width="80" />
		<div class="text">
			<h3>一款在线的 Hexo 编辑器</h3>
			<p>
				<n-button text tag="a" :href="homepage" target="_blank">Gitee</n-button>
				<n-divider vertical></n-divider>
				<n-button text tag="a" :href="homepage" target="_blank">Github</n-button>
				<n-divider vertical></n-divider>
				<n-button text>{{ version }}</n-button>
			</p>
			<p>
				CopyRight © 2023 - 2023
				<n-button text tag="a" :href="author.url" target="_blank">{{ author.name }}</n-button>
			</p>
		</div>
	</div>
</template>
