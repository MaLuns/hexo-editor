import { marked } from "marked";
import hljs from "highlight.js";
/* import tags from "./tags"; */
import { triggerHook } from "@/core/hook";

const codeReg = /(`){3}(.+?)(`){3}/gs;
const blockReg = /{%\s*([a-zA-Z0-9]+)(.+?)%}(.+?){%\s*end\1\s*%}/gs;
const innerReg = /{%\s*([a-zA-Z0-9]+)(.+?)%}/g;
const unReg = /&#123;%\s*([a-zA-Z0-9]+)(.+?)%&#125;/g;
const escapeSwigTag = (str: string) => str.replace(/{/g, "&#123;").replace(/}/g, "&#125;");
const unescapeSwigTag = (str: string) => str.replace(/&#123;/g, "{").replace(/&#125;/g, "}");

class Tags {
	stores: {
		[k: string]: {
			ends: boolean;
			fun: Function;
		};
	} = {};

	register(name: string, fun: Function, ends?: boolean) {
		this.stores[name] = {
			ends: !!ends,
			fun: fun,
		};
	}

	removeTag(name: string) {
		delete this.stores[name];
	}

	render(str: string) {
		str = str.replace(codeReg, (s) => {
			return s.match(innerReg) ? escapeSwigTag(s) : s;
		});

		str = str.replace(innerReg, (substring: string, ...args: any[]) => {
			const tag = this.stores[args[0]];
			if (tag && !tag.ends) return tag.fun(args[1].trim().split(" "));
			return substring;
		});

		str = str.replace(blockReg, (substring: string, ...args: any[]) => {
			const tag = this.stores[args[0]];
			const text = (args[2] || "").replace(/\r\n/g, "\n");
			if (tag && tag.ends) return tag.fun([args[0], ...args[1].trim().split(" ")], text);
			return substring;
		});

		str = str.replace(codeReg, (s) => {
			return s.match(unReg) ? unescapeSwigTag(s) : s;
		});
		return str;
	}
}

hljs.configure({ classPrefix: "" });
const MarkedRenderer = marked.Renderer;

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
}

const defaultConfig: marked.MarkedOptions = {
	renderer: new Renderer(),
	langPrefix: "",
	gfm: true,
	pedantic: false,
	breaks: true,
	smartLists: true,
	smartypants: true,
	mangle: true,
	headerIds: true,
};

type Filter = {
	name: string;
	type: "before" | "after";
	run: (text: string | { text: string; html: string }) => string;
};

const filters: {
	before: Filter[];
	after: Filter[];
} = {
	before: [],
	after: [],
};

export const registerFilter = (filter: Filter) => {
	filters[filter.type].push(filter);
};

/**
 * 处理外挂标签
 */
export const tags = new Tags();

/**
 * 仅渲染，不触发 Hook、Filters
 * @param text
 * @param option
 * @returns
 */
export const onlyRenderer = (text: string, option?: any) => {
	text = tags.render(text);
	return marked(text, Object.assign(defaultConfig, option)) as unknown as string;
};

/**
 * markdown 渲染
 * @param text
 * @param option
 * @returns
 */
export const renderer = (text: string, option?: any) => {
	triggerHook("MARKDOWN_RENDER_BEFORE", text);

	text = tags.render(text);
	text = filters.before.reduce((t, current) => current.run(t), text);
	let html = marked(text, Object.assign(defaultConfig, option)) as unknown as string;
	html = filters.after.reduce(
		(t, current) => {
			t.html = current.run(t);
			return t;
		},
		{ text, html }
	).html;

	triggerHook("MARKDOWN_RENDER_AFTER", { text, html });
	return html;
};
