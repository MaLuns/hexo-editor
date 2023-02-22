<script lang="ts" setup>
import { name, version, homepage } from "../../../package.json";
const showModal = ref(false);

const show = () => (showModal.value = true);

defineExpose({
	show,
});
</script>
<template>
	<ShowModal v-model:show="showModal" width="320px">
		<div class="about">
			<img class="logo" src="../../assets/logo.svg" alt="logo" />
			<h6 style="font-size: 1rem; margin: 10px 0px 4px">
				{{ name }}
				v{{ version }}
			</h6>
			<div style="font-size: 10px; margin-bottom: 10px">
				<n-button text tag="a" :href="homepage" target="_blank"> 白云苍狗 </n-button>
				@Github
			</div>
			<div style="text-indent: 2em; color: #858585">一款在线的 Hexo 博客编辑器，无需安装部署，即可在线编辑写 Hexo 博客。</div>
		</div>
	</ShowModal>
</template>
<style lang="less" scoped>
.about {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
