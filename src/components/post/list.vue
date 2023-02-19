<script lang="ts" setup>
const emit = defineEmits(['selectPost'])

const props = defineProps({
    list: Array<PostModel>,
    current: String,
    width: String
})

</script>
<template>
    <n-list class="post-list__list">
        <n-list-item :class="{ acitve: item.path === props.current }" v-for="item in props.list" :key="item.path"
            @click="emit('selectPost', item)">
            <n-thing>
                <template #header>
                    <n-ellipsis :style="{ 'max-width': 'calc(' + props.width + ' - 20px)' }" :tooltip="false"
                        style="font-size: 14px;line-height: 1.5;">
                        {{ item.title }}
                    </n-ellipsis>
                </template>
                <template #description>
                    <n-time :time="item.date" type="relative" style="font-size: 14px;" />
                </template>
            </n-thing>
        </n-list-item>
    </n-list>
</template>
<style lang="less" scoped>
.post-list__list {
    .add-post {
        line-height: 4;
        text-align: center;
    }

    .n-list-item {
        cursor: pointer;
        overflow: hidden;
        padding: 10px;

        &.acitve {
            background-color: #ffe3e3;
        }
    }
}
</style>

