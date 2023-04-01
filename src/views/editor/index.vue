<script lang="ts" setup>
import i18n from "@/i18n";
import { HexoFileType } from "@/enums";
import { fileStore, configStore, themeColors } from "@/store";
import { DocumentTextOutline } from "@vicons/ionicons5";
import ctx from "@/core/context";
import AddPost from "./add-post.vue";

import { useCommandPaletteBar } from "@/composables";

const cp = useCommandPaletteBar();

const message = useMessage();
const postEditorRef = ref();
const showModal = ref(false);

const data = reactive({
	drafts: [] as Array<PostModel>,
	posts: [] as Array<PostModel>,
	pages: [] as Array<PostModel>,
	current: "",
	openPosts: [] as Array<PostModel>,
	all: [
		{ title: computed(() => i18n.global.t("draft")), key: "drafts" },
		{ title: computed(() => i18n.global.t("publish")), key: "posts" },
		{ title: computed(() => i18n.global.t("page")), key: "pages" },
	],
});

const init = async () => {
	data.drafts = await fileStore.fs!.getDraftDirectory();
	data.posts = await fileStore.fs!.getPostDirectory();
	data.pages = await fileStore.fs!.getPageFiles();

	ctx.commnad.registerCommand(
		{
			id: "post",
			title: computed(() => i18n.global.t("command.post_list")),
			desc: `${data.pages.length + data.drafts.length + data.posts.length} 篇`,
			children: [...data.drafts, ...data.posts, ...data.pages].map((item) => {
				return {
					id: item.path,
					title: item.title,
					handle() {
						handleSelectPost(item, true);
					},
				};
			}),
		},
		true
	);
};

/**
 * 选择文章
 * @param post
 * @param isAdd 是否新增
 */
const handleSelectPost = (post: PostModel, isAdd: boolean) => {
	if (isAdd) postEditorRef.value.add(post);
	if (post) {
		data.current = post.path;
		fileStore.post = post;
	} else {
		data.current = "";
		fileStore.post = null;
	}
};

const handleCreatePost = (newData: { type: HexoFileType; post: PostModel }) => {
	switch (newData.type) {
		case HexoFileType.post:
			data.posts.unshift(newData.post);
			break;
		case HexoFileType.draft:
			data.drafts.unshift(newData.post);
			break;
		case HexoFileType.page:
			data.pages.unshift(newData.post);
			break;
	}
};

/**
 * 文章列表-菜单事件
 * @param post
 * @param key
 */
const handlePost = (post: PostModel, key: "deleteFile" | "publishPost" | "unpublishPost" | "refresh") => {
	const filterData = (key: "drafts" | "posts" | "pages", path: string) => (data[key] = data[key].filter((item) => item.path !== path));
	const getType = (path: string) => {
		if (path.includes("_drafts")) {
			return "drafts";
		} else if (path.includes("_posts")) {
			return "posts";
		} else {
			return "pages";
		}
	};

	const callbacks = {
		deleteFile: {
			success: "base.delete_success",
			error: "base.delete_error",
			fun: (post: PostModel) => {
				const key = getType(post.path);
				filterData(key, post.path);
				postEditorRef.value.remove(post.path);
			},
		},
		publishPost: {
			success: "base.publish_success",
			error: "base.publish_error",
			fun(post: PostModel, newPath: string) {
				filterData("drafts", post.path);
				post.path = newPath;
				data.posts.unshift(post);
			},
		},
		unpublishPost: {
			success: "base.unpublish_success",
			error: "base.unpublish_error",
			fun(post: PostModel, newPath: string) {
				filterData("posts", post.path);
				post.path = newPath;
				data.drafts.unshift(post);
			},
		},
	};

	switch (key) {
		case "deleteFile":
			fileStore.fs?.deleteFile(post.path).then((res) => {
				if (res) {
					message.info(i18n.global.t(callbacks[key].success));
					callbacks[key].fun(post);
				} else {
					message.error(i18n.global.t(callbacks[key].error));
				}
			});
			break;
		case "publishPost":
		case "unpublishPost":
			fileStore.fs![key](post.path).then((res) => {
				if (res.state) {
					message.info(i18n.global.t(callbacks[key].success));
					callbacks[key].fun(post, res.data!);
				} else {
					message.error(i18n.global.t(callbacks[key].error));
				}
			});
			break;
		case "refresh":
			init().then(() => {
				postEditorRef.value.update([...data.drafts, ...data.posts, ...data.pages]);
				message.info(i18n.global.t("base.refresh_success"));
			});
			break;
	}
};

// 监听按键事件
const handleKeyDown = (e: KeyboardEvent) => {
	if (e.code === "F1") {
		if (!cp.show.value) cp.open();
		e.preventDefault();
	}
	if (e.shiftKey && e.code === "KeyQ") {
		if (!cp.show.value) {
			const post = ctx.commnad.getCommand("post");
			if (post && post.children) {
				cp.open(["post", post.children[0].id]);
				e.preventDefault();
			}
		}
	}
};

onActivated(() => {
	window.addEventListener("keydown", handleKeyDown);
});
onDeactivated(() => {
	window.removeEventListener("keydown", handleKeyDown);
});

init();
</script>
<template>
	<main>
		<div v-show="configStore.layout.isShowLayoutEditorAside" class="editor-aside" @contextmenu.prevent>
			<div class="editor-aside__header">
				<n-button type="primary" secondary @click="showModal = true">
					<template #icon>
						<n-icon>
							<document-text-outline />
						</n-icon>
					</template>
					{{ $t("add_post.title") }}
				</n-button>
			</div>
			<n-scrollbar class="file-panel__scroll">
				<n-collapse class="file-panel" arrow-placement="right" :default-expanded-names="['posts']">
					<n-collapse-item v-for="item in data.all" :key="item.key" :name="item.key">
						<template #header> {{ item.title }}（{{ (data[item.key as keyof typeof data] as []).length }}） </template>
						<post-list :current="data.current" :width="configStore.layout.editorAsideWidth" :type="item.key" :list="(data[item.key as keyof typeof data] as PostModel[])" @select-post="handleSelectPost($event, true)" @delete="handlePost($event, 'deleteFile')" @publish="handlePost($event, 'publishPost')" @unpublish="handlePost($event, 'unpublishPost')" @refresh="handlePost($event, 'refresh')"> </post-list>
					</n-collapse-item>
				</n-collapse>
			</n-scrollbar>
		</div>
		<div class="editor-container">
			<post-editor ref="postEditorRef" @select="handleSelectPost($event, false)"></post-editor>
		</div>
	</main>
	<add-post v-model:show="showModal" @create="handleCreatePost"></add-post>
</template>
<style lang="less" scoped>
main {
	display: flex;
	height: 100%;
	overflow: hidden;

	.editor-aside {
		width: v-bind("configStore.layout.editorAsideWidth");
		border-right: 1px solid v-bind("themeColors.post.aside.borderColor");
		flex-shrink: 0;

		&__header {
			padding: 10px;

			:deep(.n-button) {
				width: 100%;
				box-shadow: 0 0 10px 0 #00000012;
			}
		}
	}

	:deep(.file-panel__scroll) {
		max-height: calc(100% - 54px);
		.n-scrollbar-container {
			max-height: 100%;
		}
	}

	.file-panel {
		:deep(.n-collapse-item__header),
		:deep(.n-collapse-item) {
			padding: 0 !important;
			margin: 0 !important;
		}

		:deep(.n-collapse-item__header-main) {
			--n-title-text-color: v-bind("themeColors.post.aside.list.titleColot");
			--n-title-font-weight: 600;
			--n-font-size: 12px;
			display: flex;
			justify-content: space-between;
			line-height: 32px;
			background-color: v-bind("themeColors.post.aside.list.titleBgColor");
			padding: 0 1em;
		}

		:deep(.n-collapse-item__content-inner) {
			padding: 0 !important;
		}
	}

	.editor-container {
		flex: 1;
		overflow: hidden;
	}
}
</style>
