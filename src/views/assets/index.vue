<script lang="ts" setup>
import i18n from "@/i18n";
import { fileStore } from "@/store";
import { CloseSharp } from "@vicons/ionicons5";
import { useThemeVars, type GlobalThemeOverrides } from "naive-ui";

const imageGroupThemeOverrides = computed(() => {
	const { popoverColor, boxShadow2, textColor2, borderRadius } = useThemeVars().value;
	const themeOverrides: NonNullable<GlobalThemeOverrides["Image"]> = {
		toolbarColor: popoverColor,
		toolbarBoxShadow: boxShadow2,
		toolbarIconColor: textColor2,
		toolbarBorderRadius: borderRadius,
	};
	return themeOverrides;
});

const dialog = useDialog();
const data = reactive({
	selects: [] as string[],
	list: [] as ImageModel[],
});

const init = async () => {
	data.list = await fileStore.fs!.getAssetsDirectory();
};

const handleRemove = () => {
	dialog.warning({
		title: i18n.global.t("base.tip"),
		transformOrigin: "center",
		content: i18n.global.t("assets_page.tips"),
		positiveText: i18n.global.t("base.confirm"),
		negativeText: i18n.global.t("base.cancel"),
		maskClosable: false,
		style: {
			width: "400px",
			position: "fixed",
			top: "100px",
			left: 0,
			right: 0,
		},
		onPositiveClick: () => {
			Promise.allSettled(data.selects.map((item) => fileStore.fs?.deleteFile(item))).then((res) => {
				console.log(res);
			});
		},
	});
};

const handleCancel = (item: string) => {
	if (item === "all") {
		data.selects = [];
	} else {
		data.selects = data.selects.filter((url) => url !== item);
	}
};

init();
</script>
<template>
	<n-scrollbar>
		<n-checkbox-group v-model:value="data.selects">
			<n-image-group :theme-overrides="imageGroupThemeOverrides">
				<div class="image-warp">
					<template v-for="item in data.list" :key="item.name">
						<div class="image-item">
							<div class="image-cover">
								<n-image :src="item.url" lazy />
							</div>
							<n-checkbox :value="item.path" class="image-info">
								<n-ellipsis style="max-width: 150px" :tooltip="false"> {{ item.name }} </n-ellipsis>
							</n-checkbox>
						</div>
					</template>
				</div>
			</n-image-group>
		</n-checkbox-group>
	</n-scrollbar>
	<div class="fixed-btn">
		<n-popover trigger="hover" :to="false">
			<template #trigger>
				<n-button v-show="data.selects.length" type="error" @click="handleRemove">
					<template #icon>
						<n-icon><CloseSharp /></n-icon>
					</template>
					{{ $t("base.delete") }} （{{ data.selects.length }}）
				</n-button>
			</template>
			<div>
				<n-button style="float: right; margin-bottom: 4px" size="small" @click="handleCancel('all')"> {{ $t("assets_page.clear_check") }} </n-button>
				<n-scrollbar style="max-height: 400px">
					<div v-for="item in data.selects" :key="item" class="checklist-item">
						<span>{{ item }}</span>
						<n-button class="close-icon" size="small" quaternary type="error" @click="handleCancel(item)">
							<template #icon>
								<n-icon><CloseSharp /></n-icon>
							</template>
						</n-button>
					</div>
				</n-scrollbar>
			</div>
		</n-popover>
	</div>
</template>
<style lang="less" scoped>
.fixed-btn {
	position: fixed;
	right: 0px;
	left: 0px;
	bottom: 80px;
	margin: auto;
	display: inline-block;
	width: fit-content;

	.checklist-item {
		border-radius: 4px;
		padding: 4px 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-width: max-content;
		cursor: pointer;

		.close-icon {
			margin-left: 10px;
		}
		&:hover {
			background-color: var(--n-divider-color);
		}
	}
}
.image-warp {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin: 20px 0;

	.image-item {
		width: 200px;
		height: 240px;
		margin: 10px;
		border: 1px solid #9b9b9b63;
		background-color: v-bind("imageGroupThemeOverrides.toolbarColor");
		border-radius: 8px;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;

		.image-cover {
			width: 200px;
			height: 200px;
			.n-image {
				box-sizing: border-box;
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 10px;

				:deep(img) {
					max-width: 100%;
					max-height: 100%;
				}
			}
		}

		.image-info {
			width: 100%;
			height: 40px;
			line-height: 40px;
			padding: 0 10px;
			background-color: var(--n-color-disabled-checked);
		}
	}
}
</style>
