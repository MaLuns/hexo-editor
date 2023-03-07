import { marked } from "marked";
import hljs from "highlight.js";
import tags from "./tags";
import { triggerHook } from "@/core/hook";

const MarkedRenderer = marked.Renderer;
hljs.configure({ classPrefix: "" });

class Renderer extends MarkedRenderer {
	constructor() {
		super();
	}

	code(code: string, infostring: string | undefined) {
		infostring = infostring || "";
		const langs = infostring.match(/\S*/);
		const lang = langs ? langs[0] : "";
		code = hljs.highlightAuto(code, lang ? [lang] : undefined).value;
		return `<figure class="highlight"><pre><code class="${this.options.langPrefix} ${lang}" data-language="${lang}">${code}</code></pre></figure>`;
	}

	// Prepend root to image path
	/* image(href: string, title: string | null, text: string) {
		let out = `<img src="${encodeURI(href)}"`;
		if (text) out += ` alt="${text}"`;
		if (title) out += ` title="${title}"`;

		out += ">";
		return out;
	} */
}

const defaultConfig = {
	renderer: new Renderer(),
	langPrefix: "",
	gfm: true,
	pedantic: false,
	breaks: true,
	smartLists: true,
	smartypants: true,
	modifyAnchors: 0,
	autolink: true,
	mangle: true,
	sanitizeUrl: false,
	dompurify: false,
	headerIds: true,
	anchorAlias: false,
	lazyload: false,
	prependRoot: true,
	postAsset: false,
	external_link: {
		enable: false,
		exclude: [],
		nofollow: false,
	},
	descriptionLists: true,
};

export const renderer = (text: string, option?: any) => {
	triggerHook("MARKDOWN_RENDER_BEFORE");
	const html = marked(tags.render(text), Object.assign(defaultConfig, option)) as unknown as string;
	triggerHook("MARKDOWN_RENDER_AFTER");
	return html;
};
