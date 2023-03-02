<script lang="ts" setup>
import { author, version, homepage } from "../../../package.json";
const showModal = ref(false);

const show = () => (showModal.value = true);

defineExpose({
	show,
});
</script>
<template>
	<ShowModal v-model:show="showModal" width="380px">
		<div class="about">
			<img class="logo" src="../../assets/logo.svg" alt="logo" width="80" />
			<div class="text">
				<h3 class="m-0">一款在线的 Hexo 编辑器</h3>
				<p class="m-0 p-0">
					<n-button text tag="a" :href="homepage" target="_blank"> Gitee </n-button>
					<n-divider vertical />
					<n-button text tag="a" :href="homepage" target="_blank"> Github </n-button>
					<n-divider vertical />
					v{{ version }}
				</p>
				<p class="m-0 p-0">
					CopyRight © 2018 - 2023 <n-button text tag="a" :href="author.url" target="_blank"> {{ author.name }} </n-button>
				</p>
			</div>
		</div>
	</ShowModal>
</template>
<style lang="less" scoped>
.about {
	display: flex;
	justify-content: center;
	user-select: none;
	align-items: center;
	font-size: 0.9rem;

	.logo {
		margin-right: 20px;
	}
	.text {
		text-align: center;
	}
}
</style>
