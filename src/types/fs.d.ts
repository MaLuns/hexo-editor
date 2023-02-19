declare type YamlConfig = { [k: string]: any; }

declare interface RootDirModel {
    // 文件名
    name: string,
    // 相对根目录的完整路径
    path: string,
    value: FileSystemDirectoryHandle | string
    url?: string,
    size?: 0,
    sha?: "170e7830b0b1da7c3fc88a973acceaba208a758c",
    html_url?: "https://github.com/MaLuns/hexo-theme-async/tree/master/.github",
    git_url?: "https://api.github.com/repos/MaLuns/hexo-theme-async/git/trees/170e7830b0b1da7c3fc88a973acceaba208a758c",
}

declare interface PostModel {
    // 文件名
    name: string
    // 相对根目录的完整路径
    path: string
    // 标题
    title: string
    // 创建日期
    date: Date
    // 原始内容
    raw: string
    // markdown 内容
    md: string
    _md?: string
    // 文件属性
    frontmatter: {
        [k: string]: any
    }
}

declare enum HexoFileType {
    post = 1,
    draft = 2,
    page = 3
}

declare interface PostOrPageModel {
    // 文件名
    name: string
    // 标题
    title: string
    // 创建日期
    date: Date
    // 类型
    type: HexoFileType

    [k: string]: any
}