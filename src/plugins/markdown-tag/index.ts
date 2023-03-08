import type { Plugin } from "@/core/plugin";
import { caniUse } from "./caniuse";
import { gallery, galleryGroup, galleryItem } from "./gallery";
import imgs from "./imgs";
import tabs from "./tabs";

export default <Plugin>{
	name: "markdown-tag",
	register(ctx) {
		ctx.markdown.tags.register("tabs", tabs, true);
		ctx.markdown.tags.register("imgs", imgs);
		ctx.markdown.tags.register("galleryGroup", galleryGroup, true);
		ctx.markdown.tags.register("galleryItem", galleryItem);
		ctx.markdown.tags.register("gallery", gallery);
		ctx.markdown.tags.register("caniuse", caniUse);
	},
};
