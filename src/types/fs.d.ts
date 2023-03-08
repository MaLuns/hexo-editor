declare type YamlConfig = { [k: string]: any };

/**
 * 根目录实体类
 */
declare interface RootDirModel {
	// 文件名
	name: string;
	// 相对根目录的完整路径
	path: string;
	value: FileSystemDirectoryHandle | string;
	url?: string;
	size?: 0;
	sha?: "170e7830b0b1da7c3fc88a973acceaba208a758c";
	html_url?: "https://github.com/MaLuns/hexo-theme-async/tree/master/.github";
	git_url?: "https://api.github.com/repos/MaLuns/hexo-theme-async/git/trees/170e7830b0b1da7c3fc88a973acceaba208a758c";
}

/**
 * 文章实体类
 */
declare interface PostModel {
	// 文件名
	name: string;
	// 相对根目录的完整路径
	path: string;
	// 标题
	title: string;
	// 创建日期
	date: Date;
	// 原始内容
	raw: string;
	// markdown 内容
	md: string;
	// 文件属性
	frontmatter: {
		[k: string]: any;
		_content: string;
	};
}

/**
 * 新增文章或页面
 */
declare interface PostOrPageInfoModel {
	// 文件名
	name: string;
	// 标题
	title: string;
	// 创建日期
	date: Date;
	// 类型
	type: HexoFileType;

	[k: string]: any;
}
