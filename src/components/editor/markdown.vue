<script lang="ts" setup>
import { EyeSharp, EyeOffSharp } from "@vicons/ionicons5";
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

const data = reactive({
    preview: props.preview
})

const htmlText = ref('')

const renderMarkdown = debounce(async (val: string) => {
    htmlText.value = renderer(val)
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
        <div class="markdown-editor__header">
            <div>

            </div>
            <div>
                <n-icon size="24" @click="data.preview = !data.preview;">
                    <EyeSharp v-if="data.preview" />
                    <EyeOffSharp v-else />
                </n-icon>
            </div>
        </div>
        <div class="markdown-editor__main">
            <div class="markdown-editor__editor">
                <EditorMonaco :value="props.modelValue" @save="$emit('save')" @change="handleChange" language="md"
                    :theme="props.theme">
                </EditorMonaco>
            </div>
            <div class="markdown-editor__preview" v-if="data.preview">
                <editor-preview class="editor-preview" :html="htmlText"></editor-preview>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.markdown-editor {
    display: flex;
    height: 100%;
    flex-direction: column;

    .markdown-editor__header {
        flex-shrink: 0;
        height: 36px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;

        >div {
            display: flex;
            align-items: center;
            cursor: pointer;
        }
    }

    .markdown-editor__main {
        display: flex;
        flex: 1;
        flex-shrink: 0;
        height: calc(100% - 36px);

        .markdown-editor__editor,
        .markdown-editor__preview {
            flex: 1;
            flex-shrink: 0;
            width: 50%;
        }
    }

    .editor-preview {
        width: 100%;
        height: 100%;
    }
}
</style>