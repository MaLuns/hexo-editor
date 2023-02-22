<script lang="ts" setup>
import { EyeSharp, EyeOffSharp, ListSharp, CodeSlashSharp } from "@vicons/ionicons5";
import { debounce } from "@/utils";
import { renderer } from "@/utils/md";

const emit = defineEmits(["update:modelValue", "save"]);

const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	theme: {
		type: String,
		default: "vs",
	},
	preview: {
		type: Boolean,
		default: true,
	},
});

const data = reactive({
	preview: props.preview,
});

const htmlText = ref("");

const renderMarkdown = debounce(async (val: string) => {
	htmlText.value = renderer(val);
}, 300);

const handleChange = async (val: string) => {
	emit("update:modelValue", val);
	renderMarkdown(val);
};

if (props.modelValue) {
	renderMarkdown(props.modelValue);
}
</script>
<template>
	<div class="markdown-editor">
		<div class="markdown-editor__header">
			<n-space :item-style="{ alignItems: 'center', display: 'flex' }">
				<n-icon size="22">
					<ListSharp />
				</n-icon>
				<n-icon size="22">
					<ListSharp />
				</n-icon>
				<n-icon size="22">
					<ListSharp />
				</n-icon>
				<n-icon size="22">
					<ListSharp />
				</n-icon>
				<n-icon size="22">
					<CodeSlashSharp />
				</n-icon>
			</n-space>
			<n-space :item-style="{ alignItems: 'center', display: 'flex' }">
				<n-icon size="22" @click="data.preview = !data.preview">
					<EyeSharp v-if="data.preview" />
					<EyeOffSharp v-else />
				</n-icon>
				<n-popover placement="bottom" trigger="click">
					<template #trigger>
						<n-icon size="22">
							<ListSharp />
						</n-icon>
					</template>
					<div>目录列表</div>
				</n-popover>
			</n-space>
		</div>
		<div class="markdown-editor__main">
			<div class="markdown-editor__editor">
				<EditorMonaco :value="props.modelValue" language="md" :theme="props.theme" @save="$emit('save')" @change="handleChange"> </EditorMonaco>
			</div>
			<div v-if="data.preview" class="markdown-editor__preview">
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

		.n-icon {
			transition: color 0.3s;
			cursor: pointer;

			&:hover {
				color: #8c63ca;
			}
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
