<script lang="ts" setup>
import { useWindowResize } from "@/composables";
import { fileStore } from "@/store";

const emit = defineEmits(['select'])
const maxHeight = useWindowResize(40)

const data = reactive({
    tabName: '',
    tabs: <Array<PostModel>>[]
})

const closeTabs = (name: string) => {
    const index = data.tabs.findIndex(item => item.path === name)
    data.tabs.splice(index, 1)
    if (data.tabName === name) {
        let tab = data.tabs[Math.max(0, index - 1)]
        data.tabName = tab ? tab.path : ''
        emit('select', data.tabName)
    }
}

const changeTabs = (path: string) => {
    const tab = data.tabs.find(item => item.path === path)
    emit('select', tab?.path)
}

const handleSave = async (post: PostModel) => {
    let res = await fileStore.fs?.savePost(post)
    if (res) {
        post._md = post.md
    } else {
        window.$message.warning('文章保存失败')
    }
}

const add = (post: PostModel) => {
    let item = data.tabs.find(item => item.path === post.path)
    if (!item) {
        data.tabs.push(post)
    }
    data.tabName = post.path
}

defineExpose({
    add
})
</script>
<template>
    <n-tabs v-model:value="data.tabName" type="card" closable @update:value="changeTabs" tab-style="min-width: 120px;"
        pane-style="height:calc(100vh - 40px);" @close="closeTabs">
        <n-tab-pane class="tab-pane" v-for="panel in data.tabs" :key="panel.path" :tab="panel.path" :name="panel.path"
            display-directive="show:lazy">
            <template #tab>
                {{ panel.name }}
                <span class="save-tag" v-if="panel.md !== panel._md"></span>
            </template>
            <EditorMarkdown @save="handleSave(panel)" v-model="panel.md" theme="vs"> </EditorMarkdown>
        </n-tab-pane>
    </n-tabs>
</template>
<style lang="less" scoped>
.tab-pane {
    padding: 0;

    :deep(.v-md-editor) {
        box-shadow: none;
    }

}

.save-tag {
    display: inline-block;
    width: 10px;
    height: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e2bf5d;
    border-radius: 50%;
    margin-left: 10px;
}
</style>