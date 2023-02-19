<script lang="ts" setup>
import { debounce } from '@/utils';
import { renderer } from '@/utils/md';

const emit = defineEmits(['update:modelValue', 'save'])

const props = defineProps({
    modelValue: String,
    theme: String,
    preview: {
        type: Boolean,
        default: true
    }
})

const htmlText = ref('')

const renderMarkdown = debounce(async (val: string) => {
    htmlText.value = await renderer(val)
}, 300)

const handleChange = async (val: string) => {
    emit('update:modelValue', val)
    renderMarkdown(val)
}

if (props.modelValue) {
    renderMarkdown(props.modelValue)
}
</script>
<template>
    <div class="markdown-editor">
        <div class="markdown-editor__editor">
            <div></div>
            <EditorMonaco :value="props.modelValue" @save="$emit('save')" @change="handleChange" language="md"
                :theme="props.theme">
            </EditorMonaco>
        </div>
        <div class="markdown-editor__preview" v-if="props.preview">
            <div></div>
            <editor-preview class="editor-preview" :html="htmlText"></editor-preview>
        </div>
    </div>
</template>
<style lang="less" scoped>
.markdown-editor {
    display: flex;
    height: 100%;

    .markdown-editor__editor,
    .markdown-editor__preview {
        flex: 1;
        flex-shrink: 0;
        width: 50%;
    }

    .editor-preview {
        width: 100%;
        height: 100%;
    }
}
</style>