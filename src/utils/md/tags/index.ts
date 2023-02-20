import { gallery, galleryGroup, galleryItem } from './gallery';
import imgs from './imgs';
import tabs from './tabs';

const blockReg = /{%\s*([a-zA-Z0-9]+)(.+?)%}(.+?){%\s*end\1\s*%}/gs;
const innerReg = /{%\s*([a-zA-Z0-9]+)(.+?)%}/gs;

class Tags {
    stores: {
        [k: string]: {
            ends: boolean
            fun: Function
        }
    } = {}

    register(name: string, fun: Function, ends?: boolean) {
        this.stores[name] = {
            ends: !!ends,
            fun: fun
        }
    }

    unregister(name: string) {
        delete this.stores[name]
    }

    render(str: string) {
        str = str.replace(innerReg, (substring: string, ...args: any[]) => {
            const tag = this.stores[args[0]]
            if (tag && !tag.ends) return tag.fun(args[1].trim().split(' '))
            return substring;
        })

        str = str.replace(blockReg, (substring: string, ...args: any[]) => {
            const tag = this.stores[args[0]]
            const text = (args[2] || '').replace(/\r\n/g, '\n')
            if (tag && tag.ends) return tag.fun([args[0], ...args[1].trim().split(' ')], text)
            return substring;
        })

        return str
    }
}

const tags = new Tags()
tags.register('tabs', tabs, true)
tags.register('imgs', imgs)

tags.register('galleryGroup', galleryGroup, true)
tags.register('galleryItem', galleryItem)
tags.register('gallery', gallery)


export default tags