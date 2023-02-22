<script setup lang="ts">
import { NIcon, type DropdownOption } from "naive-ui";
import { LogoGithub, GitBranch, FileTrayFull } from "@vicons/ionicons5";
import Left from "./left.vue";
import Right from "./right.vue";
import { fileStore } from "@/store";
import DataDB from "@/utils/dataDB";
import FileSystem from "@/utils/fs/index";
import type AbstractFileSystem from "@/utils/fs/core/AbstractFileSystem";
enum FileStoreTypeEnum {
	Local = 1,
	Github = 2,
	Gitee = 3,
}
const route = useRouter();
window.$message = useMessage();

const db = new DataDB<FileStoreModel>("hexo-editor-file", "fs", 1);

const data = reactive({
	list: <Array<any>>[],
});

const renderIcon = (type: FileStoreTypeEnum) => {
	const icon = type === FileStoreTypeEnum.Local ? FileTrayFull : type === FileStoreTypeEnum.Github ? LogoGithub : GitBranch;
	return () => {
		return h(NIcon, null, {
			default: () => h(icon),
		});
	};
};

db.getAll().then((res) => {
	data.list = res.map((item) => {
		return {
			label: item.name,
			key: item.id,
			icon: renderIcon(item.type),
			...item,
		};
	});
});

const openLocalFile = async (type: FileStoreTypeEnum) => {
	if (type === FileStoreTypeEnum.Local) {
		const fs = FileSystem.getInstance("LocalFileSystem");
		const root = await fs.getRootsDirectory();
		if (root) {
			const item = data.list.find((item) => {
				if (item.name === root.name && item.type === FileStoreTypeEnum.Local) return (root.value as FileSystemDirectoryHandle).isSameEntry(item.value);
				return false;
			});
			if (!item) db.add({ name: root.name, value: root.value, type: FileStoreTypeEnum.Local });
			openEditor(fs);
		}
	}
};

const selectHistory = async (key: string | number, option: DropdownOption) => {
	if (option.type === FileStoreTypeEnum.Local) {
		let fs = FileSystem.getInstance("LocalFileSystem");
		if (await fs.getRootsDirectory(option.value as FileSystemDirectoryHandle)) {
			openEditor(fs);
		}
	}
};

const openEditor = async (fs: AbstractFileSystem) => {
	const config = await fs.getHexoConfig();
	if (config) {
		fileStore.setFileSystem(fs);
		route.push({ name: "editer" });
	}
};
</script>

<template>
	<div class="banner">
		<n-el class="left-image">
			<Left></Left>
		</n-el>
		<div>
			<n-h1 style="font-size: 64px !important; font-weight: 600">Hexo-Editor</n-h1>
			<n-p style="font-size: 16px; margin-top: 0"> 一个在线的 Hexo 编辑器 </n-p>
			<n-space justify="center">
				<n-button type="primary" size="large" @click="openLocalFile(FileStoreTypeEnum.Local)"> 打开 Hexo 目录 </n-button>
				<n-dropdown placement="bottom-start" trigger="hover" :options="data.list" @select="selectHistory">
					<n-button type="default" size="large"> 最近使用 </n-button>
				</n-dropdown>
			</n-space>
		</div>
		<n-el class="right-image">
			<Right></Right>
		</n-el>
	</div>
</template>
<style lang="less" scoped>
.banner {
	height: calc(100vh - 64px);
	display: flex;
	flex-direction: column;
	position: relative;
	text-align: center;
	justify-content: center;

	.left-image {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: calc(50% + 300px);
		width: calc(50% - 300px);
		min-width: 340px;
	}

	.right-image {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: calc(50% + 300px);
		width: calc(50% - 300px);
		min-width: 340px;
	}
}
</style>
