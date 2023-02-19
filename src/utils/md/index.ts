import { marked } from 'marked';
import hljs from 'highlight.js'

const MarkedRenderer = marked.Renderer;
hljs.configure({ classPrefix: '' });

class Renderer extends MarkedRenderer {
    constructor() {
        super();
    }

    code(code: string, infostring: string | undefined, escaped: boolean) {
        infostring = infostring || ''
        let langs = infostring.match(/\S*/)
        let lang = langs ? langs[0] : ''
        code = hljs.highlightAuto(code, lang ? [lang] : undefined).value
        return `<figure class="highlight"><pre><code class="${this.options.langPrefix} ${lang}" data-language="${lang}">${code}</code></pre></figure>`
    }

    // Prepend root to image path
    image(href: string, title: string | null, text: string) {
        if (!/^(#|\/\/|http(s)?:)/.test(href)) {
            // 转换本地路径
            console.log(href);

        }

        let out = `<img src="${encodeURI(href)}"`;
        if (text) out += ` alt="${text}"`;
        if (title) out += ` title="${title}"`;

        out += '>';
        return out;
    }
}

marked.setOptions({
    renderer: new Renderer(),
    langPrefix: '',
    /* highlight: function (code) {
        return hljs.highlightAuto(code).value
    }, */
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
});


export const renderer = async (text: string, option?: any) => {
    const renderer = new Renderer();
    return await marked(text,
        Object.assign({
            renderer
        }, option)
    )
}