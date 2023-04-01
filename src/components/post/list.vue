<script lang="ts" setup>
import i18n from "@/i18n";
import { themeColors } from "@/store";
import { Bug, ArrowUndoCircle, Send, RefreshSharp } from "@vicons/ionicons5";
import { ChartArcs } from "@vicons/tabler";
import { NAvatar, NIcon, NText, NTime } from "naive-ui";

const emit = defineEmits(["selectPost", "publish", "unpublish", "delete", "refresh"]);

const props = defineProps({
	list: {
		type: Array<PostModel>,
		default: [],
	},
	current: {
		type: String,
		default: "",
	},
	width: {
		type: String,
		default: "200px",
	},
	type: {
		type: String,
		default: "",
	},
});

const renderIcon = (icon: Component) => {
	return () => {
		return h(NIcon, null, {
			default: () => h(icon),
		});
	};
};

const menuOptions = [
	{
		label: computed(() => i18n.global.t("post.list_menus.refresh")),
		key: "refresh",
		icon: renderIcon(markRaw(RefreshSharp)),
		menu_keys: true,
	},
	{
		label: computed(() => i18n.global.t("post.list_menus.publish")),
		key: "publish",
		icon: renderIcon(markRaw(Send)),
		menu_keys: ["drafts"],
	},
	{
		label: computed(() => i18n.global.t("post.list_menus.unpublish")),
		key: "unpublish",
		icon: renderIcon(markRaw(ArrowUndoCircle)),
		menu_keys: ["posts"],
	},
	{
		label: computed(() => i18n.global.t("post.list_menus.delete")),
		key: "delete",
		icon: renderIcon(markRaw(Bug)),
		menu_keys: true,
	},
].filter((item) => {
	return Array.isArray(item.menu_keys) ? item.menu_keys.includes(props.type || "-1") : item.menu_keys;
});

const showDropdownRef = ref(false);
const xRef = ref(0);
const yRef = ref(0);
const data = reactive({
	options: [] as any[],
});

let currentPost: PostModel | null = null;

const renderCustomHeader = () =>
	h(
		"div",
		{
			style: "display: flex; align-items: center; padding: 8px 12px;",
		},
		[
			h(
				NAvatar,
				{
					round: true,
					style: "margin-right: 12px;background-color: #705697;",
				},
				h(NIcon, null, h(ChartArcs))
			),
			h("div", null, [
				h("div", null, h(NText, { depth: 2 }, { default: () => currentPost?.title })), //
				h("div", { style: "font-size: 12px;" }, h(NText, { depth: 3 }, currentPost?.path)),
			]),
		]
	);

const handleContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	showDropdownRef.value = false;
	nextTick().then(() => {
		showDropdownRef.value = true;
		xRef.value = e.clientX;
		yRef.value = e.clientY;

		data.options = [
			{
				key: "title",
				type: "render",
				render: renderCustomHeader,
			},
			{
				key: "header-divider",
				type: "divider",
			},
			...menuOptions,
		];
	});
};

const onClickoutside = () => {
	showDropdownRef.value = false;
};

const handleMouseenter = (post: PostModel) => {
	currentPost = post;
};

const handleSelect = (key: "publish" | "unpublish" | "delete" | "refresh") => {
	showDropdownRef.value = false;
	emit(key, currentPost);
};
</script>
<template>
	<n-list class="post-list__list" @contextmenu="handleContextMenu">
		<n-list-item v-for="item in props.list" :key="item.path" :class="{ acitve: item.path === props.current }" @click="emit('selectPost', item)" @mouseenter="handleMouseenter(item)">
			<n-thing>
				<template #header>
					<n-ellipsis :style="{ 'max-width': 'calc(' + props.width + ' - 60px)' }" :tooltip="false" style="font-size: 14px; line-height: 1.5">
						{{ item.title }}
					</n-ellipsis>
				</template>
				<template #description>
					<n-time :time="item.date" type="relative" style="font-size: 14px" />
				</template>
			</n-thing>
		</n-list-item>
		<n-list-item v-if="!props.list.length">
			<n-space justify="center"> 未找到文件信息... </n-space>
		</n-list-item>
	</n-list>
	<n-dropdown placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :options="data.options" :show="showDropdownRef" :on-clickoutside="onClickoutside" @select="handleSelect" />
</template>
<style lang="less" scoped>
.post-list__list {
	user-select: none;

	.add-post {
		line-height: 4;
		text-align: center;
	}

	.n-list-item {
		cursor: pointer;
		overflow: hidden;
		padding: 10px;

		&.acitve {
			background-color: v-bind("themeColors.post.aside.list.activeBgColor");
		}
	}
}
</style>
