<script lang="ts" setup>
import { fileStore, themmStore } from "@/store";
import { DocumentTextOutline } from "@vicons/ionicons5";
import AddPost from "./addPost.vue";

const message = useMessage();
const postEditorRef = ref();
const showModal = ref(false);

const data = reactive({
    drafts: <PostModel[]>[],
    posts: <PostModel[]>[],
    pages: <PostModel[]>[],
    current: "",
    openPosts: <PostModel[]>[],
    all: [
        { title: "草稿", key: "drafts" },
        { title: "已发布", key: "posts" },
        { title: "页面", key: "pages" },
    ],
});

const init = () => {
    fileStore.fs?.getDraftDirectory().then((res) => {
        data.drafts = res;
    });
    fileStore.fs?.getPostDirectory().then((res) => {
        data.posts = res;
    });
    fileStore.fs?.getPageFiles().then((res) => {
        data.pages = res;
    });
};

const selectPost = (post: PostModel) => {
    postEditorRef.value.add(post);
    data.current = post.path;
};

const createPost = (newData: { type: HexoFileType; post: PostModel }) => {
    switch (newData.type) {
        case 1:
            data.posts.unshift(newData.post);
            break;
        case 2:
            data.drafts.unshift(newData.post);
            break;
        case 3:
            data.pages.unshift(newData.post);
            break;
    }
};

const handleDelete = (post: PostModel) => {
    fileStore.fs?.deleteFile(post.path).then((res) => {
        if (res) {
            message.info("删除成功！");
        } else {
            message.error("删除失败！");
        }
    });
};

init();
</script>
<template>
    <main>
        <div class="editor-aside">
            <div class="editor-aside__header">
                <n-button type="primary" secondary @click="showModal = true">
                    <template #icon>
                        <n-icon>
                            <DocumentTextOutline />
                        </n-icon>
                    </template>
                    新增文章
                </n-button>
            </div>
            <n-scrollbar style="max-height: calc(100% - 30px)">
                <n-collapse class="demosss" arrow-placement="right" :default-expanded-names="['posts']">
                    <n-collapse-item v-for="item in data.all" :name="item.key">
                        <template #header> {{ item.title }}（{{ (data[item.key as keyof typeof data] as []).length }}） </template>
                        <PostList :current="data.current" :width="themmStore.config.editorAsideWidth" :type="item.key" :list="(data[item.key as keyof typeof data] as PostModel[])" @selectPost="selectPost" @delete="handleDelete"> </PostList>
                    </n-collapse-item>
                </n-collapse>
            </n-scrollbar>
        </div>
        <div class="editor-container">
            <PostEditor ref="postEditorRef" @select="data.current = $event"></PostEditor>
        </div>
    </main>
    <AddPost v-model:show="showModal" @create="createPost"></AddPost>
</template>
<style lang="less" scoped>
main {
    display: flex;
    height: 100%;
    overflow: hidden;

    .editor-aside {
        width: v-bind("themmStore.config.editorAsideWidth");
        border-right: 1px solid #eee;
        flex-shrink: 0;

        &__header {
            padding: 10px;

            :deep(.n-button) {
                width: 100%;
                box-shadow: 0 0 10px 0 #00000012;
            }
        }
    }

    .editor-container {
        flex: 1;
        overflow: hidden;
    }

    .demosss {
        :deep(.n-collapse-item__header),
        :deep(.n-collapse-item) {
            padding: 0 !important;
            margin: 0 !important;
        }

        :deep(.n-collapse-item__header-main) {
            --n-title-text-color: #616161;
            --n-title-font-weight: 600;
            --n-font-size: 12px;
            display: flex;
            justify-content: space-between;
            line-height: 32px;
            background-color: #f9f9ff;
            padding: 0 1em;
        }

        :deep(.n-collapse-item__content-inner) {
            padding: 0 !important;
        }
    }
}
</style>
