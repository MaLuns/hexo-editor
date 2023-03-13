import type { HexoFileType } from "@/enums";

export default abstract class AbstractFileSystem {
	/**
	 *  获取根目录
	 */
	abstract getRootsDirectory(handle?: any): Promise<RootDirModel | undefined>;

	/**
	 *  获取 Hexo 配置文件
	 */
	abstract getHexoConfig(): Promise<{ raw: string | undefined; path: string; config: YamlConfig }>;

	/**
	 * 获取主题配置文件
	 * @param path 文件地址
	 */
	abstract getThemeConfig(): Promise<{ raw: string | undefined; path: string; config: YamlConfig }>;

	/**
	 * 更新文件
	 * @param path
	 * @param text
	 */
	abstract updateFile(path: string, text: string): Promise<boolean>;

	/**
	 *  获取所有 page
	 */
	abstract getPageFiles(): Promise<PostModel[]>;

	/**
	 *  获取所有已发布文章
	 */
	abstract getPostDirectory(): Promise<PostModel[]>;

	/**
	 *  获取所有草稿文章
	 */
	abstract getDraftDirectory(): Promise<PostModel[]>;

	/**
	 *  上传图片
	 */
	abstract uploadImage(file: File, path: string): Promise<string>;

	/**
	 * 获取图片路径
	 * @param path 图片相对路径
	 * @returns 返回图片路径、Blob 地址、或 base64
	 */
	abstract getImageUrl(path: string): Promise<string>;

	/**
	 * 新增 文章或自定义页面
	 * @param info
	 */
	abstract addPostOrPage(info: PostOrPageInfoModel): Promise<PostModel | undefined>;

	/**
	 * 删除文件
	 * @param path 文件路径
	 */
	abstract deleteFile(path: string): Promise<boolean>;

	/**
	 * 保存 文章信息
	 * @param post
	 */
	abstract savePost(post: PostModel): Promise<boolean>;

	/**
	 * 发布文章
	 * @param path 文件地址
	 */
	abstract publishPost(path: string): Promise<FsResult<string>>;

	/**
	 * 取消发布
	 * @param path 文件地址
	 */
	abstract unpublishPost(path: string): Promise<FsResult<string>>;

	/**
	 * 判断路径是否存在
	 * @param path 文件地址
	 */
	abstract isPathExist(path: string): Promise<boolean>;

	/**
	 * 获取新增文件-完整路径
	 * @param name 文件名
	 * @param type 文件类型
	 */
	abstract getFullPathByAdd(name: string, type: HexoFileType): Promise<string>;

	/**
	 * 转换预览文章中 图片路径
	 * @param text HTML 片段
	 * @param path 文章路径
	 */
	abstract transformImgUrl(text: string, path: string): Promise<string>;
}
