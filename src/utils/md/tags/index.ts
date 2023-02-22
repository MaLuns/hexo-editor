import { caniUse } from "./caniuse";
import { gallery, galleryGroup, galleryItem } from "./gallery";
import imgs from "./imgs";
import tabs from "./tabs";

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

    unregister(name: string) {
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

const tags = new Tags();
tags.register("tabs", tabs, true);
tags.register("imgs", imgs);
tags.register("galleryGroup", galleryGroup, true);
tags.register("galleryItem", galleryItem);
tags.register("gallery", gallery);
tags.register("caniuse", caniUse);

export default tags;
