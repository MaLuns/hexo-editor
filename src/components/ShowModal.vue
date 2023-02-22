<script lang="ts" setup>
const props = defineProps({
    show: Boolean,
    title: String,
    width: {
        type: String,
        default: "400px",
    },
});

const modalStyle = {
    position: "fixed",
    top: "100px",
    left: 0,
    right: 0,
};
</script>
<template>
    <n-modal :show="props.show" @update:show="$emit('update:show', $event)" transform-origin="center" :trap-focus="false">
        <n-card :title="title" :style="{ ...modalStyle, width: props.width }">
            <slot></slot>
        </n-card>
    </n-modal>
</template>
