import yaml from "js-yaml";
import fm from "@/utils/front-matter"
import AbstractFileSystem from "./AbstractFileSystem";
import { formatDate } from '@/utils';

enum HexoFileType {
    post = 1,
    draft = 2,
    page = 3
}

/**
 * 读取文件信息
 * @param file 
 * @returns 
 */
const parsePost = async (file: FileSystemFileHandle) => {
    let rawText = await file.getFile().then(res => res.text())
    let fmData = fm.parse(rawText)
    let post: PostModel = {
        name: file.name,
        path: file.name,
        title: fmData.title,
        date: fmData.date,
        raw: rawText,
        md: fmData._content,
        frontmatter: {
            ...fmData
        }
    }
    return post
}

/**
 * 判断路径是否存在
 * @param dir 
 * @param path 
 * @returns 
 */
const isPathExist = async (dir: FileSystemDirectoryHandle, path: string): Promise<boolean> => {
    const paths = path.split('/')
    const len = paths.length - 1
    let current: FileSystemDirectoryHandle | FileSystemFileHandle | null = dir

    for (const [index, name] of paths.entries()) {
        if (len === index) {
            if (name !== '')
                current = await (<FileSystemDirectoryHandle>current)!.getFileHandle(name, { create: false }).catch(_ => null)
        } else {
            current = await (<FileSystemDirectoryHandle>current)!.getDirectoryHandle(name, { create: false }).catch(_ => null)
        }
        if (!current) return false
    }
    return !!current
}

/**
 * 创建文件或文件夹
 * @param dir 
 * @param path 
 */
const createFileOrDir = async (dir: FileSystemDirectoryHandle, path: string) => {
    const paths = path.split('/')
    const len = paths.length - 1
    let current: FileSystemDirectoryHandle | FileSystemFileHandle | null = dir

    for (const [index, name] of paths.entries()) {
        if (len === index) {
            if (name !== '') {
                current = await (<FileSystemDirectoryHandle>current)!.getFileHandle(name, { create: true }).catch(_ => null)
            }
        } else {
            current = await (<FileSystemDirectoryHandle>current)!.getDirectoryHandle(name, { create: true }).catch(_ => null)
        }
    }
    return current
}

/**
 * Yaml DumpOptions
 */
const yamlDumpOpt = {
    lineWidth: 2000,
    styles: {
        '!!bool': 'lowercase',
        '!!null': 'empty'
    },
    prefixSeparator: true
}

export default class LocalFileSystem extends AbstractFileSystem {
    _root: FileSystemDirectoryHandle | undefined
    _hexo_config: YamlConfig | undefined
    _hexo_theme_config: YamlConfig | undefined


    /**
     * 跟据路径返回 FileSystemHandle
     * @param path 
     */
    async _getHandle(path: string): Promise<FileSystemDirectoryHandle | null>
    async _getHandle(path: string, isFile: boolean): Promise<FileSystemFileHandle | null>
    async _getHandle(path: string, isFile?: boolean): Promise<FileSystemDirectoryHandle | FileSystemFileHandle | null> {
        if (this._root) {
            const paths = path.split('/')
            const len = paths.length - 1
            let currentHandle: FileSystemDirectoryHandle | FileSystemFileHandle | null = this._root

            for (let index = 0; index <= len; index++) {
                if (currentHandle) {
                    const element = paths[index];
                    if (index === len && isFile !== undefined) {
                        currentHandle = await (currentHandle as FileSystemDirectoryHandle).getFileHandle(element, { create: false }).catch(() => null)
                    } else {
                        currentHandle = await (currentHandle as FileSystemDirectoryHandle).getDirectoryHandle(element, { create: false }).catch(() => null)
                    }

                } else {
                    return null;
                }
            }

            return currentHandle;
        } else {
            return null;
        }
    }

    async getRootsDirectory(handle?: FileSystemDirectoryHandle): Promise<RootDirModel | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                if (handle) {
                    let state = await handle.queryPermission({ mode: 'readwrite' })
                    const res = {
                        name: handle.name,
                        path: handle.name,
                        value: handle
                    }
                    if (state === 'granted') {
                        this._root = handle
                        resolve(res)
                    }

                    state = await handle.requestPermission({ mode: 'readwrite' })
                    if (state === 'granted') {
                        this._root = handle
                        resolve(res)
                    } else {
                        window.$message.error(`已拒绝对 ${handle.name} 访问权限`)
                        resolve(undefined)
                    }
                } else {
                    const directoryHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker()
                    this._root = directoryHandle
                    resolve({
                        name: directoryHandle.name,
                        path: directoryHandle.name,
                        value: directoryHandle
                    })
                }
            } catch (error) {
                window.$message.warning('文件信息读取失败')
                resolve(undefined)
            }
        })
    }

    async getHexoConfig(): Promise<YamlConfig | undefined> {
        try {
            if (this._hexo_config) {
                return this._hexo_config
            } else {
                let config = await this._root?.getFileHandle('_config.yml', { create: false }).catch(_ => null)
                if (!config) {
                    config = await this._root?.getFileHandle('_config.yaml', { create: false }).catch(_ => null)
                    if (!config) {
                        window.$message.warning(`未找到 _config.yml 或 _config.yaml 文件`)
                        return;
                    }
                }
                const hexoConfigText = await config.getFile().then(res => res.text())
                this._hexo_config = yaml.load(hexoConfigText) as YamlConfig;
                console.log(this);

                return this._hexo_config
            }
        } catch (error) {
            window.$message.warning('Hexo 配置文件读取失败')
        }
    }

    async getThemeConfig(path: string): Promise<YamlConfig | undefined> {
        try {
            if (this._hexo_theme_config) {
                return this._hexo_theme_config
            } else {
                const config = await this._root?.getFileHandle(path, { create: false }).catch(_ => null)
                if (!config) {
                    window.$message.warning(`未找到 ${path} 文件`)
                    return;
                }
                const hexoConfigText = await config.getFile().then(res => res.text())
                this._hexo_theme_config = yaml.load(hexoConfigText) as YamlConfig;
                return this._hexo_theme_config
            }
        } catch (error) {
            window.$message.warning('主题配置文件获取失败')
        }
    }

    async getPageFiles(): Promise<PostModel[]> {
        const hexoThemeConfig = await this.getHexoConfig()
        let posts: PostModel[] = []

        const getPage = async (dir: FileSystemDirectoryHandle, path: string) => {
            const posts: PostModel[] = []
            for await (const data of dir.entries()) {
                const [key, value] = data as [string, FileSystemDirectoryHandle | FileSystemFileHandle]
                if (value.name.startsWith('_')) break;
                if (value.kind === 'directory') {
                    posts.push(...  await getPage(value, `${path}/${value.name}`))
                } else {
                    if (value.name.endsWith('.md')) {
                        let post = await parsePost(value)
                        post.path = `${path}/${value.name}`
                        posts.push(post)
                    }
                }
            }
            return posts
        }

        if (hexoThemeConfig) {
            const sourceDirectoryHandle = await this._root?.getDirectoryHandle(hexoThemeConfig.source_dir, { create: true })
            if (sourceDirectoryHandle) {
                posts = await getPage(sourceDirectoryHandle, hexoThemeConfig.source_dir);
            }
        }

        return posts
    }

    /**
     * 获取文章列表
     * @param type 
     * @returns 
     */
    async _getPostsByType(type: 'post' | 'draft'): Promise<PostModel[]> {
        const hexoThemeConfig = await this.getHexoConfig()
        const posts: PostModel[] = []

        if (hexoThemeConfig) {
            const sourceDirectoryHandle = await this._root?.getDirectoryHandle(hexoThemeConfig.source_dir, { create: true })
            const name = type === 'post' ? '_posts' : '_drafts'
            const postDirectoryHandle = await sourceDirectoryHandle?.getDirectoryHandle(name, { create: true })
            for await (const data of postDirectoryHandle?.entries()) {
                const [key, value] = data as [string, FileSystemDirectoryHandle | FileSystemFileHandle]
                if (value.kind === 'file') {
                    const post = await parsePost(value)
                    post.path = `${hexoThemeConfig.source_dir}/${name}/${value.name}`
                    posts.push(post)
                }
            }
        }
        posts.sort((a, b) => b.date.getTime() - a.date.getTime())
        return posts
    }

    async getPostDirectory(): Promise<PostModel[]> {
        return this._getPostsByType('post');
    }

    async getDraftDirectory(): Promise<PostModel[]> {
        return this._getPostsByType('draft');
    }

    async uploadImage(): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getImageUrl(path: string): Promise<string> {
        const file = await this._getHandle(path, true)
        return file ? URL.createObjectURL(await file.getFile()) : ''
    }

    async addPostOrPage(info: PostOrPageModel): Promise<boolean> {
        try {
            /* const config = await this.getHexoConfig()
            if (!config) return false */

            const { name, type, ...res } = info
            /* const bool: boolean = config.post_asset_folder */

            /*  const path = await this.getFullPathByAdd(name, type)
             let handle = await createFileOrDir(this._root!, path)
             if (type === HexoFileType.page) {
                 handle = await (<FileSystemDirectoryHandle>handle).getFileHandle('index.md', { create: true }).catch(_ => null)
             }
             const writer = await (<FileSystemFileHandle>handle).createWritable({ keepExistingData: false })
  */
            const frontmatter = fm.stringify(res, yamlDumpOpt)
            const postText = `---\r\n${frontmatter}---`
            console.log(frontmatter, res);

            /*  await writer.write(postText)
             await writer.close() */
            return true
        } catch (error) {
            return false
        }
    }

    async savePost(post: PostModel): Promise<boolean> {
        try {
            const fileHandle = await this._getHandle(post.path, true)
            if (fileHandle) {
                const frontmatter = fm.stringify({
                    ...post.frontmatter,
                    title: post.title,
                    _content: post.md,
                }, yamlDumpOpt)

                console.log(frontmatter);

                /* const writer = await fileHandle.createWritable({ keepExistingData: false })
                await writer.write(postText)
                await writer.close() */
                return true
            }
            return false
        } catch (error) {
            console.log(error);

            return false
        }
    }

    async publishPost(path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async unpublishPost(path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async isPathExist(path: string): Promise<boolean> {
        return isPathExist(this._root!, path)
    }

    async getFullPathByAdd(name: string, type: HexoFileType): Promise<string> {
        let config = await this.getHexoConfig()
        let path = (config?.source || 'source') + '/'
        switch (type) {
            case HexoFileType.post:
                path += `_posts/${name}${name.endsWith('.md') ? '' : '.md'}`
                break;
            case HexoFileType.draft:
                path += `_drafts/${name}${name.endsWith('.md') ? '' : '.md'}`
                break;
            case HexoFileType.page:
                path += name + '/'
                break;
        }
        return path
    }
}