import type { Plugin } from "@/core/plugin";

function extractToc(html: string, option = { min_depth: 1, max_depth: 6 }): TocNode[] {
	const parser = new DOMParser();
	const dom = parser.parseFromString(html, "text/html");
	const tocs: TocNode[] = [];

	const headingsSelector = ["h1", "h2", "h3", "h4", "h5", "h6"].slice(option.min_depth - 1, option.max_depth);
	const headings = Array.from(dom.querySelectorAll(headingsSelector.join(",")));

	const insert = (tocs: TocNode[], newToc: TocNode) => {
		const toc = tocs[tocs.length - 1];
		if (toc && toc.level < newToc.level) {
			insert(toc.children, newToc);
		} else {
			tocs.push(newToc);
		}
	};

	headings.map((heading) => {
		const level = parseInt(heading.tagName.slice(1));
		const id = heading.id;
		const text = heading.textContent || "";

		insert(tocs, {
			id,
			level,
			text,
			children: [],
		});
	});

	return tocs;
}

export default <Plugin>{
	name: "markdown-toc",
	register(ctx) {
		ctx.hook.registerHook("MARKDOWN_RENDER_AFTER", function (e) {
			ctx.store.fileStore.tocs = extractToc(e.html);
		});
	},
};
