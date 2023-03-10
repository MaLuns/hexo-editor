import type { Plugin } from "@/core/plugin";

export default <Plugin>{
	name: "editor-paste",
	register(ctx) {
		ctx.hook.registerHook("MONACO_MARKDOWN_READY", function (e) {
			const editor = e.editor;
			const dom = e.editor.getContainerDomNode();
			dom.addEventListener(
				"paste",
				async (e: ClipboardEvent) => {
					if (!editor.hasTextFocus() || !ctx.store.fileStore.post) {
						return;
					}

					const items = e.clipboardData!.items;
					for (let i = 0; i < items.length; i++) {
						const fileType = items[i].type;
						if (fileType.indexOf("image") !== -1) {
							e.preventDefault();
							e.stopPropagation();

							const assetPath = await ctx.store.fileStore.fs?.uploadImage(items[i].getAsFile()!, ctx.store.fileStore.post!.path);
							ctx.editor.tools.insert(editor, `![Img](${assetPath})\n`);
						} else if (fileType.indexOf("text")) {
							//TODO  处理文本转换
						}
					}
				},
				true
			);
		});
	},
};
