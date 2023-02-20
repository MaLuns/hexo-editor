<script lang="ts" setup>
import { fileStore } from '@/store';
import { regexRules } from '@/utils';
import type { FormInst, FormItemRule, FormRules } from 'naive-ui';

const emit = defineEmits(['update:show', 'create'])
const formRef = ref<FormInst | null>(null)

const props = defineProps({
    show: Boolean
})

const model = reactive({
    title: '',
    name: '',
    date: null,
    type: <HexoFileType>1
})

const rules: FormRules = {
    title: {
        required: true,
        trigger: ['blur'],
        message: '请输入标题'
    },
    name: <FormItemRule>{
        trigger: 'blur',
        required: true,
        async asyncValidator(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
            if (regexRules.fileName.test(value)) {
                const path = await fileStore.fs!.getFullPathByAdd(value, model.type)
                const isExist = await fileStore.fs!.isPathExist(path)
                if (isExist) {
                    callback(new Error(`文件已存在 ${path} `))
                } else {
                    return true
                }
            } else {
                callback(new Error('文件名仅能为字母、数组、常规符合'))
            }
        },
    },
    date: {
        required: true,
        trigger: ['change'],
        message: '请选择日期'
    }
}

const options: { label: string, value: HexoFileType }[] = [
    { label: '文章', value: 1 },
    { label: '草稿', value: 2 },
    { label: '页面', value: 3 }
]

const modalStyle = {
    width: '400px',
    position: 'fixed',
    top: '100px',
    left: 0,
    right: 0
}

const handleValidateClick = () => {
    formRef.value?.validate((errors) => {
        if (!errors) {
            const { title, type, name, date } = model
            fileStore.fs?.addPostOrPage({ title, type, name, date: new Date(date!) }).then(post => {
                if (post) emit('create', { type, post })
            })
        }
    })
}
</script>
<template>
    <n-modal :show="props.show" @update:show="$emit('update:show', $event)" transform-origin="center">
        <n-card title="新增文章" :style="modalStyle">
            <n-form ref="formRef" :rules="rules" :model="model" label-width="auto" label-placement="left"
                require-mark-placement="right-hanging">
                <n-form-item label="标题" path="title">
                    <n-input v-model:value="model.title" placeholder="文章" />
                </n-form-item>
                <n-form-item label="文件名" path="name">
                    <n-input v-model:value="model.name" placeholder="文件名" />
                </n-form-item>
                <n-form-item label="日期" path="date">
                    <n-date-picker v-model:formatted-value="model.date" type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" />
                </n-form-item>
                <n-form-item label="类型" path="type">
                    <n-select v-model:value="model.type" filterable placeholder="选择类型" :options="options"> </n-select>
                </n-form-item>
            </n-form>
            <n-space justify="end">
                <n-button @click="handleValidateClick" type="primary">确定</n-button>
                <n-button @click="$emit('update:show', false)">取消</n-button>
            </n-space>
        </n-card>
    </n-modal>
</template>