export default abstract class AbstractFileSystem {
    /**
     *  获取文件根
     */
    abstract getRootsDirectory(handle?: any): Promise<RootDirModel | undefined>

    /**
     *  获取配置文件
     */
    abstract getHexoConfig(): Promise<YamlConfig | undefined>

    /**
     *  获取主题配置文件
     */
    abstract getThemeConfig(path: string): Promise<YamlConfig | undefined>

    /**
     *  获取 page 文件
     */
    abstract getPageFiles(): Promise<PostModel[]>

    /**
     *  获取已发布文章
     */
    abstract getPostDirectory(): Promise<PostModel[]>

    /**
     *  获取草稿文章
     */
    abstract getDraftDirectory(): Promise<PostModel[]>

    /**
     *  上传图片
     */
    abstract uploadImage(): Promise<string>

    /**
     * 获取图片路径
     * @param path 图片相对路径
     * @returns 返回图片路径、Blob 地址、或 base64
     */
    abstract getImageUrl(path: string): Promise<string>

    /**
     *  添加 文章 或 页面
     */
    abstract addPostOrPage(info: PostOrPageModel): Promise<PostModel | undefined>

    /**
     *  编辑文章
     */
    abstract savePost(post: PostModel): Promise<boolean>

    /**
     *  发布文章
     */
    abstract publishPost(path: string): Promise<boolean>

    /**
     *  取消发布
     */
    abstract unpublishPost(path: string): Promise<boolean>

    /**
     * 判断路径是否存在
     * @param path 
     */
    abstract isPathExist(path: string): Promise<boolean>

    /**
     * 获取新增文件-完整路径
     * @param name 
     * @param type 
     */
    abstract getFullPathByAdd(name: string, type: HexoFileType): Promise<string>
}

