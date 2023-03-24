<script setup lang="ts">
import type AbstractFileSystem from "@/core/file-system/abstract-file-system";
import { NIcon } from "naive-ui";
import { LogoGithub, GitBranch, FileTrayFull, CloseSharp } from "@vicons/ionicons5";
import { fileStore } from "@/store";
import { FileStoreTypeEnum } from "@/enums";
import DataDB from "@/utils/data-db";
import FileSystem from "@/core/file-system";

const route = useRouter();
window.$message = useMessage();

const db = new DataDB<FileStoreModel>("hexo-editor-file", "fs", 1, "id");

const data = reactive({
	list: [] as Array<any>,
	isFileSystem: Boolean(window.showDirectoryPicker),
});

const renderIcon = (type: FileStoreTypeEnum) => {
	const icon = type === FileStoreTypeEnum.Local ? FileTrayFull : type === FileStoreTypeEnum.Github ? LogoGithub : GitBranch;
	return () => h(NIcon, null, { default: () => h(icon) });
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

const handleOpenLocalFile = async (type: FileStoreTypeEnum) => {
	if (type === FileStoreTypeEnum.Local) {
		const fs = FileSystem.getInstance(FileStoreTypeEnum.Local);
		const root = await fs.getRootsDirectory();
		if (root) {
			const item = data.list.find((item) => (item.name === root.name && item.type === FileStoreTypeEnum.Local ? (root.value as FileSystemDirectoryHandle).isSameEntry(item.value) : false));
			if (!item) {
				db.add({
					id: `${FileStoreTypeEnum.Local}/${root.name}`,
					name: root.name,
					value: root.value,
					type: FileStoreTypeEnum.Local,
				});
			}
			openEditor(fs);
		}
	}
};

const handleSelectHistory = async (item: FileStoreModel) => {
	if (item.type === FileStoreTypeEnum.Local) {
		let fs = FileSystem.getInstance(FileStoreTypeEnum.Local);
		if (await fs.getRootsDirectory(item.value as FileSystemDirectoryHandle)) {
			openEditor(fs);
		}
	}
};

const openEditor = async (fs: AbstractFileSystem) => {
	const { config } = await fs.getHexoConfig();
	if (config) {
		fileStore.setFileSystem(fs);
		route.push({ name: "editer" });
	}
};

const handleDelete = (item: FileStoreModel, index: number) => {
	db.delete(item.id!).then(() => {
		data.list.splice(index, 1);
	});
};
</script>

<template>
	<section class="banner">
		<header class="navigation">
			<div class="container">
				<span class="title"> Hexo-Editor </span>
				<div></div>
			</div>
		</header>
		<div class="banner-shape2">
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 1920 920">
				<defs>
					<linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
						<stop offset="0" stop-color="#3f48ef" />
						<stop offset="1" stop-color="#4855f9" />
					</linearGradient>
				</defs>
				<g id="Group_1939" data-name="Group 1939" transform="translate(0 0.601)">
					<path id="_2" data-name="2" d="M5127,919.4s424.672-234.31,932.879-77S7047,850.756,7047,850.756V-.028L5127-.6Z" transform="translate(-5127)" fill="url(#linear-gradient)" />
					<path id="_1" data-name="1" d="M5127,168.681S5551.672,685.089,6059.879,842.4,7047,850.756,7047,850.756V-.028L5127-.6Z" transform="translate(-5127)" fill="#3f48ef" />
				</g>
			</svg>
		</div>
		<div class="banner-shape3">
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1920 920">
				<path id="_3" data-name="3" d="M5127,919.4s424.672-234.31,932.879-77S7047,850.756,7047,850.756V-.028L5127-.6Z" transform="translate(-5127 0.601)" fill="#e5f3fe" />
			</svg>
		</div>
		<div class="banner-shape4">
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1920 920">
				<path id="_4" data-name="4" d="M5127,919.4s424.672-234.31,932.879-77S7047,850.756,7047,850.756V-.028L5127-.6Z" transform="translate(-5127 0.601)" fill="#e5f3fe" opacity="0.5" />
			</svg>
		</div>
		<div class="banner-main container">
			<div class="banner-content">
				<h1>Online Hexo Editor</h1>
				<p>Hexo Editor is a web editor for hexo blog platform. Can you manage and edit your article information online.</p>
				<div class="btn" @click="handleOpenLocalFile(FileStoreTypeEnum.Local)">Open Hexo directory</div>
				<ul v-if="data.list.length" class="recently-opened">
					<div class="recently-opened-title">Recently opened</div>
					<li v-for="(item, index) in data.list" :key="item.key" class="recently-opened-item" @click="handleSelectHistory(item)">
						<span> / {{ item.label }}</span>
						<n-icon :size="20" :component="CloseSharp" class="close-icon" @click.stop="handleDelete(item, index)"></n-icon>
					</li>
				</ul>
			</div>
			<div class="banner-img">
				<div class="banner-shape">
					<div class="banner-shape-img">
						<img src="../../assets/banner/bg-shape1.png" alt="" class="img-fluid" />
					</div>
					<div class="banner-shape-img2">
						<img src="../../assets/banner/bg-shape2.png" alt="" class="img-fluid" />
					</div>
					<div class="banner-shape-img3">
						<img src="../../assets/banner/bg-shape3.png" alt="" class="img-fluid" />
					</div>
					<div class="banner-shape-img4">
						<img src="../../assets/banner/bg-shaperound.png" alt="" class="img-fluid" />
					</div>
					<div class="banner-shape-img5"></div>
					<img src="../../assets/banner/banner-img3.png" alt="" class="img-fluid" />
				</div>
			</div>
		</div>
	</section>
</template>
<style lang="less" scoped>
.container {
	max-width: 1200px;
	margin: 0 auto;
}
.navigation {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 60px;
	line-height: 60px;
	z-index: 999;
	border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	padding: 14px 10px;
	.title {
		font-size: 28px;
		color: #fff;
		font-weight: bold;
	}
}
.banner {
	position: absolute;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background-color: #fff;
	background-color: white;
	z-index: -1;

	&:before {
		position: absolute;
		content: "";
		right: -5%;
		width: 30%;
		height: 100%;
		background: url(../../assets/banner/banner-shape-3.png) no-repeat;
		background-position: top center;
		top: 20%;
		margin-top: -50px;
		opacity: 0.15;
	}
	.banner-shape2 {
		position: absolute;
		content: "";
		left: 0px;
		right: 0px;
		width: 100%;
		top: 0px;
		z-index: -1;
	}

	.banner-shape3 {
		position: absolute;
		content: "";
		left: 0px;
		right: 0px;
		width: 102%;
		top: 20px;
		z-index: -2;
	}

	.banner-shape4 {
		position: absolute;
		content: "";
		left: 0px;
		right: 0px;
		width: 103%;
		top: 30px;
		z-index: -2;
	}

	.banner-main {
		margin: 200px auto;
		display: flex;

		.banner-content {
			position: absolute;
			width: 600px;
			padding-top: 20px;

			h1 {
				font-size: 54px;
				line-height: 66px;
				color: #fff;
			}
			p {
				color: #f5f5f5;
				padding-bottom: 40px;
				margin: 0;
			}
			.btn {
				user-select: none;
				font-weight: 500;
				position: relative;
				z-index: 1;
				overflow: hidden;
				text-transform: capitalize;
				padding: 15px 40px;
				border-radius: 40px;
				font-size: 16px;
				border: 1px solid transparent;
				transition: all 0.3s ease-in-out;
				border-color: #fff;
				color: #fff;
				display: inline-block;
				cursor: pointer;

				&:hover {
					color: #ffffff;
					border-color: #486df3;
					background: #486df3;
				}
			}

			.recently-opened {
				color: #ffffff;
				list-style: none;
				margin: 0;
				padding: 16px 0 0 40px;
				width: 300px;
				display: inline-block;
				vertical-align: top;

				.recently-opened-title {
					font-size: 16px;
					font-weight: bold;
					margin-bottom: 10px;
				}

				.recently-opened-item {
					cursor: pointer;
					padding: 10px 20px;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.close-icon {
						padding: 4px;
						border-radius: 4px;
						margin-left: 10px;
					}

					&:hover {
						background: #486df3;
						border-radius: 4px;
						.close-icon {
							background: #ffffff2b;
						}
					}
				}
			}
		}
		.banner-img {
			position: absolute;
		}
		.banner-shape {
			position: absolute;
			width: 640px;
			left: 670px;

			.banner-shape-img4 {
				position: absolute;
				left: 0px;
				text-align: center;
				right: 0px;
				animation: rotateme2 5s infinite linear;
				width: 30%;
				margin-top: 0px;
				margin-left: 30px;
			}

			.banner-shape-img3 {
				position: absolute;
				right: 0px;
				left: 0px;
				text-align: center;
				top: 49%;
				margin-left: 150px;
				animation: heartBeat 5s infinite linear;
			}

			.banner-shape-img2 {
				position: absolute;
				right: 0px;
				left: 0px;
				text-align: center;
				top: 0;
				margin-left: 50px;
				margin-top: -60px;
				z-index: 1;
				animation: float-y 5s infinite linear;
			}

			.banner-shape-img5 {
				animation: zoom-fade 5s infinite linear;
				position: absolute;
				bottom: -270px;
				right: -20px;
				width: 500px;
				height: 250px;
				background: url(../../assets/banner/bg-shape1.png) no-repeat;
			}

			.img-fluid {
				max-width: 100%;
				height: auto;
			}
		}
	}
}

@keyframes zoom-fade {
	0% {
		transform: scale(0.9);
	}
	50% {
		transform: scale(1);
	}
	100% {
		transform: scale(0.9);
	}
}

@keyframes rotateme2 {
	from {
		transform: rotateY(0deg);
	}
	to {
		transform: rotateY(360deg);
	}
}

@keyframes float-y {
	0% {
		transform: translateY(0px);
	}
	25% {
		transform: translateY(25px);
	}
	50% {
		transform: translateY(50px);
	}
	70% {
		transform: translateY(70px);
	}
	100% {
		transform: translateY(0px);
	}
}

@keyframes heartBeat {
	0% {
		-webkit-transform: scale(1);
		transform: scale(1);
	}

	14% {
		-webkit-transform: scale(1.3);
		transform: scale(1.3);
	}

	28% {
		-webkit-transform: scale(1);
		transform: scale(1);
	}

	42% {
		-webkit-transform: scale(1.3);
		transform: scale(1.3);
	}

	70% {
		-webkit-transform: scale(1);
		transform: scale(1);
	}
}
</style>
