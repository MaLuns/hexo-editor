<script lang="ts" setup>
import { DocumentText, Bug, ArrowUndoCircle, Send, RefreshSharp } from "@vicons/ionicons5";
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
		label: "刷新列表",
		key: "refresh",
		icon: renderIcon(markRaw(RefreshSharp)),
		menu_kesy: true,
	},
	{
		label: "发布文章",
		key: "publish",
		icon: renderIcon(markRaw(Send)),
		menu_kesy: ["drafts"],
	},
	{
		label: "取消发布",
		key: "unpublish",
		icon: renderIcon(markRaw(ArrowUndoCircle)),
		menu_kesy: ["posts"],
	},
	{
		label: "删除文件",
		key: "delete",
		icon: renderIcon(markRaw(Bug)),
		menu_kesy: true,
	},
].filter((item) => {
	return Array.isArray(item.menu_kesy) ? item.menu_kesy.includes(props.type || "-1") : item.menu_kesy;
});

const showDropdownRef = ref(false);
const xRef = ref(0);
const yRef = ref(0);
const data = reactive({
	options: [] as Array<{
		key: string;
		label?: string;
		type?: string;
		menu_kesy?: boolean | string[];
		disabled?: boolean;
		render?: any;
	}>,
});

let currentPost: PostModel | null = null;

const renderCustomHeader = () => {
	/* h(NTime, { time: currentPost?.date }) */
	return h(
		"div",
		{
			style: "display: flex; align-items: center; padding: 8px 12px;",
		},
		[
			h(
				NAvatar,
				{
					round: true,
					style: "margin-right: 12px;",
				},
				h(NIcon, {}, h(DocumentText))
			),
			h("div", null, [h("div", null, [h(NText, { depth: 2 }, { default: () => currentPost?.title })]), h("div", { style: "font-size: 12px;" }, [h(NText, { depth: 3 }, currentPost?.path)])]),
		]
	);
};

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

const handleSelect = (key: "publish" | "unpublish" | "delete") => {
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
			background-color: #fff7ed;
		}
	}
}
</style>
