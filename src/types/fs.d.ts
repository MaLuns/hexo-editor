declare type YamlConfig = { [k: string]: any };

/**
 * 根目录实体类
 */
declare interface RootDirModel {
	/**
	 * 文件名
	 */
	name: string;
	/**
	 * 相对根目录的完整路径
	 */
	path: string;
	/**
	 * 根目录根据 FileSystem 类型决定
	 */
	value: FileSystemDirectoryHandle | string;
}

/**
 * 文章实体类
 */
declare interface PostModel {
	/**
	 * 文件名
	 */
	name: string;
	/**
	 * 相对根目录的完整路径
	 */
	path: string;
	/**
	 * 标题
	 */
	title: string;
	/**
	 * 创建日期
	 */
	date: Date;
	/**
	 * 原始内容
	 */
	raw: string;
	/**
	 * markdown 内容
	 */
	md: string;
	/**
	 * 文件属性
	 */
	frontmatter: {
		[k: string]: any;
		_content: string;
	};
}

/**
 * 新增文章或页面
 */
declare interface PostOrPageInfoModel {
	/**
	 * 文件名
	 */
	name: string;
	/**
	 * 标题
	 */
	title: string;
	/**
	 * 创建日期
	 */
	date: Date;
	/**
	 * 类型
	 */
	type: HexoFileType;

	[k: string]: any;
}

/**
 * 图片信息
 */
declare interface ImageModel {
	/**
	 * 图片名称
	 */
	name: string;
	/**
	 * 图片相对路径
	 */
	path: string;
	/**
	 * 图片地址
	 */
	url: string;
	/**
	 * 大小
	 */
	size: string;
}

/**
 * FileSystem 操作结果
 */
declare interface FsResult<T> {
	/**
	 * 状态
	 */
	state: boolean;
	/**
	 * 消息
	 */
	message?: string;
	/**
	 * 返回数据
	 */
	data?: T;
}
