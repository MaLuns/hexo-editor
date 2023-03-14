import type { Plugin } from "@/core/plugin";
import fm from "@/utils/front-matter";

export default <Plugin>{
	name: "markdown-front-matter",
	register(ctx) {
		ctx.markdown.registerFilter({
			name: "markdown-front-matter",
			type: "before",
			run({ text }) {
				if (ctx.store.configStore.hideFrontMatter) {
					return text;
				} else {
					const fmData = fm.parse(text);
					return fmData._content;
				}
			},
		});
	},
};
