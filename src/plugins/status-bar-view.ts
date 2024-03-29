import type { Plugin } from "@/core/plugin";
import { LayoutBoard } from "@vicons/tabler";

export default <Plugin>{
	name: "status-bar-view",
	register(ctx) {
		const configStore = ctx.store.configStore;
		const viewList: StatusMenuItem[] = [
			{
				id: "status-bar-view.isshowlayouteditoraside",
				title: "显示侧栏",
				type: "normal",
				checked: computed(() => Boolean(configStore.layout.isShowLayoutEditorAside)),
				onClick: () => {
					configStore.layout.isShowLayoutEditorAside = !configStore.layout.isShowLayoutEditorAside;
				},
			},
			{
				id: "status-bar-view.isshowmarkdowneditor",
				title: "显示编辑",
				type: "normal",
				checked: computed(() => configStore.layout.isShowMarkdownEditor),
				onClick: () => {
					configStore.layout.isShowMarkdownEditor = !configStore.layout.isShowMarkdownEditor;
				},
			},
			{
				id: "status-bar-view.isshowmarkdownprew",
				title: "显示预览",
				type: "normal",
				checked: computed(() => configStore.layout.isShowMarkdownPrew),
				onClick: () => {
					configStore.layout.isShowMarkdownPrew = !configStore.layout.isShowMarkdownPrew;
				},
			},
		];

		viewList.forEach((item) => {
			if (item.type === "normal") {
				ctx.commnad.registerCommand({
					id: item.id,
					title: item.title,
					desc: "切换" + item.title,
					handle: <CommandPalette["handle"]>item.onClick,
				});
			}
		});
		ctx.statusBar.tapMenus((menus) => {
			menus["status-bar-view"] = {
				id: "status-bar-view",
				position: "left",
				title: "视图",
				icon: LayoutBoard,
				list: [...viewList],
			};
		});
	},
};
