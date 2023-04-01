<script lang="ts" setup>
import type { FormInst, FormItemRule, FormRules } from "naive-ui";
import type { HexoFileType } from "@/enums";
import i18n from "@/i18n";
import { fileStore } from "@/store";
import { regexRules } from "@/utils";

const emit = defineEmits(["update:show", "create"]);
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const props = defineProps({
	show: Boolean,
});

const model = reactive({
	title: "",
	name: "",
	date: null,
	type: 1 as HexoFileType,
});

const rules: FormRules = {
	title: {
		required: true,
		trigger: ["blur"],
		message: i18n.global.t("add_post.post_title_empty"),
	},
	name: {
		trigger: "blur",
		required: true,
		async asyncValidator(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
			if (regexRules.fileName.test(value)) {
				const path = await fileStore.fs!.getFullPathByAdd(value, model.type);
				const isExist = await fileStore.fs!.isPathExist(path);
				if (isExist) {
					callback(new Error(i18n.global.t("add_post.file_name_exist", [path])));
				} else {
					return true;
				}
			} else {
				callback(new Error(i18n.global.t("add_post.file_name_error")));
			}
		},
	} as FormItemRule,
	date: {
		required: true,
		trigger: ["change"],
		message: i18n.global.t("add_post.post_date_empty"),
	},
};

const options: { label: string; value: HexoFileType }[] = [
	{ label: "文章", value: 1 },
	{ label: "草稿", value: 2 },
	{ label: "页面", value: 3 },
];

const modalStyle = {
	width: "400px",
	position: "fixed",
	top: "100px",
	left: 0,
	right: 0,
};

const handleValidateClick = () => {
	formRef.value?.validate((errors) => {
		if (!errors) {
			const { title, type, name, date } = model;
			fileStore.fs?.addPostOrPage({ title, type, name, date: new Date(date!) }).then((post) => {
				if (post) {
					emit("create", { type, post });
					emit("update:show", false);
					message.success(i18n.global.t("base.create_success"));
				}
			});
		}
	});
};
</script>
<template>
	<n-modal :show="props.show" transform-origin="center" @update:show="$emit('update:show', $event)">
		<n-card :title="$t('add_post.title')" :style="modalStyle">
			<n-form ref="formRef" :rules="rules" :model="model" label-width="auto" label-placement="left" require-mark-placement="right-hanging">
				<n-form-item :label="$t('add_post.post_title')" path="title">
					<n-input v-model:value="model.title" :placeholder="$t('add_post.post_title')" />
				</n-form-item>
				<n-form-item :label="$t('add_post.file_name')" path="name">
					<n-input v-model:value="model.name" :placeholder="$t('add_post.file_name')" />
				</n-form-item>
				<n-form-item :label="$t('add_post.post_date')" path="date">
					<n-date-picker v-model:formatted-value="model.date" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" />
				</n-form-item>
				<n-form-item :label="$t('add_post.post_type')" path="type">
					<n-select v-model:value="model.type" filterable :placeholder="$t('add_post.post_type')" :options="options"> </n-select>
				</n-form-item>
			</n-form>
			<n-space justify="end">
				<n-button type="primary" @click="handleValidateClick">{{ $t("base.confirm") }}</n-button>
				<n-button @click="$emit('update:show', false)">{{ $t("base.cancel") }}</n-button>
			</n-space>
		</n-card>
	</n-modal>
</template>
