import type { Plugin } from "@/core/plugin";
import * as hexo from "@/core/hexo";
import AbstractFileSystem from "@/core/file-system/abstract-file-system";
import { FileStoreTypeEnum, HexoFileType } from "@/enums";
import { configStore } from "@/store";

/**
 * 读取文件信息
 * @param file
 * @returns
 */
const parsePost = async (file: FileSystemFileHandle) => {
	const rawText = await file.getFile().then((res) => res.text());
	const { title, date, ...fmData } = hexo.parseMd(rawText);
	const post: PostModel = {
		name: file.name,
		path: file.name,
		title: title,
		date: date,
		raw: rawText,
		md: configStore.hideFrontMatter ? fmData._content : rawText,
		frontmatter: {
			...fmData,
		},
	};
	return post;
};

/**
 * 判断路径是否存在
 * @param dir
 * @param path
 * @returns
 */
const isPathExist = async (dir: FileSystemDirectoryHandle, path: string): Promise<boolean> => {
	const paths = path.split("/");
	const len = paths.length - 1;
	let current: FileSystemDirectoryHandle | FileSystemFileHandle | null = dir;

	for (const [index, name] of paths.entries()) {
		if (len === index) {
			if (name !== "") current = await (<FileSystemDirectoryHandle>current)!.getFileHandle(name, { create: false }).catch(() => null);
		} else {
			current = await (<FileSystemDirectoryHandle>current)!.getDirectoryHandle(name, { create: false }).catch(() => null);
		}
		if (!current) return false;
	}
	return !!current;
};

/**
 * 创建文件或文件夹
 * @param dir  根目录的 FileSystemDirectoryHandle
 * @param path  以为 '/' 结尾，视为创建文件夹
 */
const createFileOrDir = async (dir: FileSystemDirectoryHandle, path: string) => {
	const paths = path.split("/");
	const len = paths.length - 1;
	let current: FileSystemDirectoryHandle | FileSystemFileHandle | null = dir;

	for (const [index, name] of paths.entries()) {
		if (len === index) {
			if (name !== "") {
				current = await (<FileSystemDirectoryHandle>current)!.getFileHandle(name, { create: true }).catch(() => null);
			}
		} else {
			current = await (<FileSystemDirectoryHandle>current)!.getDirectoryHandle(name, { create: true }).catch(() => null);
		}
	}
	return current;
};

/**
 * 复制文件夹
 * @param sourceDir
 * @param targetDir
 */
const copyDirectory = async (sourceDir: FileSystemDirectoryHandle, targetDir: FileSystemDirectoryHandle): Promise<boolean> => {
	try {
		let flag = true;
		// 递归复制子目录
		for await (const [, entry] of sourceDir.entries()) {
			if (entry.isFile) {
				// 如果是文件，复制到目标目录中
				const file = await entry.getFile();
				const newFile = await targetDir.getFileHandle(file.name, { create: true });
				const writer = await newFile.createWritable({ keepExistingData: false });
				await writer.write(await file.arrayBuffer());
				await writer.close();
			} else if (entry.isDirectory) {
				// 如果是子目录，创建新目录并递归复制
				const newDir = await targetDir.getDirectoryHandle(entry.name, { create: true });
				flag = flag && (await copyDirectory(entry, newDir));
			}
		}
		return flag;
	} catch (error) {
		return false;
	}
};

/**
 * 复制文件到指定目录
 * @param sourceFile
 * @param targetFile
 */
const conpyFile = async (sourceFile: FileSystemFileHandle, targetDir: FileSystemDirectoryHandle) => {
	try {
		const newFile = await targetDir.getFileHandle(sourceFile.name, { create: true });
		const writer = await newFile.createWritable({ keepExistingData: false });
		await writer.write(await (await sourceFile.getFile()).arrayBuffer());
		await writer.close();
		return true;
	} catch (error) {
		return false;
	}
};

class LocalFileSystem extends AbstractFileSystem {
	_root: FileSystemDirectoryHandle | undefined;
	_hexo_config: YamlConfig | undefined;
	_hexo_config_raw: string | undefined;
	_hexo_theme_config: YamlConfig | undefined;
	_hexo_theme_config_raw: string | undefined;
	_cache_img: { [k: string]: string } = {};

	/**
	 * 跟据路径返回 FileSystemHandle （不会自动创建）
	 * @param path
	 */
	async _getHandle(path: string): Promise<FileSystemDirectoryHandle | null>;
	/**
	 * 跟据路径返回 FileSystemHandle （不会自动创建）
	 * @param path
	 * @param isFile
	 */
	async _getHandle(path: string, isFile: boolean): Promise<FileSystemFileHandle | null>;
	async _getHandle(path: string, isFile?: boolean): Promise<FileSystemDirectoryHandle | FileSystemFileHandle | null> {
		if (this._root) {
			const paths = path.split("/");
			const len = paths.length - 1;
			let currentHandle: FileSystemDirectoryHandle | FileSystemFileHandle | null = this._root;

			for (let index = 0; index <= len; index++) {
				if (currentHandle) {
					const element = paths[index];
					if (index === len && isFile !== undefined) {
						currentHandle = await (currentHandle as FileSystemDirectoryHandle).getFileHandle(element, { create: false }).catch(() => null);
					} else {
						currentHandle = await (currentHandle as FileSystemDirectoryHandle).getDirectoryHandle(element, { create: false }).catch(() => null);
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

	/**
	 * 获取已发布文件夹 Handle
	 * @returns
	 */
	async _getPostDirHandle(): Promise<FileSystemDirectoryHandle | null> {
		const { config } = await this.getHexoConfig();
		const path = hexo.getSourcePath(config?.source, "/_posts");
		return this._getHandle(path);
	}

	/**
	 * 获取草稿文件夹 Handle
	 * @returns
	 */
	async _getDraftsDirHandle(): Promise<FileSystemDirectoryHandle | null> {
		const { config } = await this.getHexoConfig();
		const path = hexo.getSourcePath(config?.source, "/_drafts");
		return this._getHandle(path);
	}

	/**
	 * 是否开启文章资源文件夹
	 * @returns
	 */
	async _isPostAssetFolder(): Promise<boolean> {
		const { config } = await this.getHexoConfig();
		if (!config) return false;
		return Boolean(config.post_asset_folder);
	}

	/**
	 * 读取配置信息
	 * @param path
	 * @param type
	 * @returns
	 */
	async _getConfig(path: string, type: "hexo" | "theme"): Promise<{ raw: string | undefined; path: string; config: YamlConfig }> {
		try {
			const configKey = type === "hexo" ? "_hexo_config" : "_hexo_theme_config";
			const rawKey = type === "hexo" ? "_hexo_config_raw" : "_hexo_theme_config_raw";

			if (this[configKey]) {
				return { path, raw: this[rawKey], config: this[configKey]! };
			} else {
				const configFileHandle = await this._getHandle(path, true).catch(() => null);
				if (!configFileHandle) {
					window.$message.warning(`未找到 ${path} 文件`);
					return { path, raw: undefined, config: {} };
				}
				const hexoConfigText = await configFileHandle.getFile().then((res) => res.text());
				this[rawKey] = hexoConfigText;
				this[configKey] = hexo.parseYaml(hexoConfigText);
				return { path, raw: this[rawKey], config: this[configKey]! };
			}
		} catch (error) {
			window.$message.warning("Hexo 配置文件读取失败");
			return { path, raw: undefined, config: {} };
		}
	}

	async getRootsDirectory(handle?: FileSystemDirectoryHandle): Promise<RootDirModel | undefined> {
		return new Promise(async (resolve) => {
			try {
				if (handle) {
					let state = await handle.queryPermission({ mode: "readwrite" });
					const res = {
						name: handle.name,
						path: handle.name,
						value: handle,
					};
					if (state === "granted") {
						this._root = handle;
						resolve(res);
					}

					state = await handle.requestPermission({ mode: "readwrite" });
					if (state === "granted") {
						this._root = handle;
						resolve(res);
					} else {
						window.$message.error(`已拒绝对 ${handle.name} 访问权限`);
						resolve(undefined);
					}
				} else {
					const directoryHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker();
					this._root = directoryHandle;
					resolve({
						name: directoryHandle.name,
						path: directoryHandle.name,
						value: directoryHandle,
					});
				}
			} catch (error) {
				window.$message.warning("文件信息读取失败");
				resolve(undefined);
			}
		});
	}

	async getHexoConfig(): Promise<{ raw: string | undefined; path: string; config: YamlConfig }> {
		return this._getConfig("_config.yml", "hexo");
	}

	async getThemeConfig(): Promise<{ raw: string | undefined; path: string; config: YamlConfig }> {
		const config = await this.getHexoConfig();
		const themeName = config.config.theme;
		if (themeName) {
			let configPath = `_config.${themeName}.yml`;
			let isExist = await this.isPathExist(configPath);
			if (!isExist) {
				configPath = `themes/${themeName}/_config.yml`;
				isExist = await this.isPathExist(configPath);
			}
			if (isExist) {
				return await this._getConfig(configPath, "theme");
			} else {
				window.$message.warning("未找到主题配置文件");
				return { path: "", raw: undefined, config: {} };
			}
		} else {
			window.$message.warning("主题配置文件读取失败");
			return { path: "", raw: undefined, config: {} };
		}
	}

	async updateFile(path: string, text: string): Promise<boolean> {
		try {
			const fileHandle = await this._getHandle(path, true);
			if (fileHandle) {
				const writer = await fileHandle.createWritable({ keepExistingData: false });
				await writer.write(text);
				await writer.close();
				return true;
			} else {
				return false;
			}
		} catch (error) {
			return false;
		}
	}

	async getPageFiles(): Promise<PostModel[]> {
		const { config } = await this.getHexoConfig();
		let posts: PostModel[] = [];

		const getPage = async (dir: FileSystemDirectoryHandle, path: string) => {
			const posts: PostModel[] = [];
			for await (const data of dir.entries()) {
				const [, value] = data as [string, FileSystemDirectoryHandle | FileSystemFileHandle];
				if (value.name.startsWith("_")) break;
				if (value.kind === "directory") {
					posts.push(...(await getPage(value, `${path}/${value.name}`)));
				} else {
					if (value.name.endsWith(".md")) {
						const post = await parsePost(value);
						post.path = `${path}/${value.name}`;
						posts.push(post);
					}
				}
			}
			return posts;
		};

		if (config) {
			const sourceDirectoryHandle = await this._root?.getDirectoryHandle(config.source_dir, { create: true });
			if (sourceDirectoryHandle) {
				posts = await getPage(sourceDirectoryHandle, config.source_dir);
			}
		}

		return posts;
	}

	/**
	 * 获取文章列表
	 * @param type
	 * @returns
	 */
	async _getPostsByType(type: "post" | "draft"): Promise<PostModel[]> {
		const posts: PostModel[] = [];
		const { config } = await this.getHexoConfig();
		if (config) {
			const sourceDirectoryHandle = await this._root?.getDirectoryHandle(config.source_dir, { create: true });
			const name = type === "post" ? "_posts" : "_drafts";
			const postDirectoryHandle = await sourceDirectoryHandle?.getDirectoryHandle(name, { create: true });

			for await (const [, value] of postDirectoryHandle!.entries()) {
				if (value.kind === "file" && value.name.endsWith(".md")) {
					const post = await parsePost(value);
					post.path = `${config.source_dir}/${name}/${value.name}`;
					posts.push(post);
				}
			}
		}
		posts.sort((a, b) => b.date.getTime() - a.date.getTime());
		return posts;
	}

	async getPostDirectory(): Promise<PostModel[]> {
		return this._getPostsByType("post");
	}

	async getDraftDirectory(): Promise<PostModel[]> {
		return this._getPostsByType("draft");
	}

	async uploadImage(file: File, path: string): Promise<string> {
		const bool = await this._isPostAssetFolder();
		const fileName = `${hexo.getImageName()}.${file.name.split(".")[1]}`;
		let assetsDir = "";
		let imgPath = fileName;

		if (bool) {
			assetsDir = path.replace(".md", "/");
		} else {
			const { config } = await this.getHexoConfig();
			const sourceDir = hexo.getSourcePath(config?.source);
			assetsDir = configStore.imgStorageDir || `${sourceDir}/images/`;
			imgPath = `${assetsDir}/${fileName}`;
		}

		const assetsDirHandle = (await createFileOrDir(this._root!, assetsDir)) as FileSystemDirectoryHandle;
		const imgHandle = await assetsDirHandle.getFileHandle(fileName, { create: true });
		const write = await imgHandle.createWritable({ keepExistingData: false });
		await write.write(file);
		await write.close();
		return imgPath;
	}

	async getImageUrl(path: string): Promise<string> {
		if (!this._cache_img[path]) {
			const file = await this._getHandle(path, true);
			this._cache_img[path] = file ? URL.createObjectURL(await file.getFile()) : "";
		}
		return this._cache_img[path];
	}

	async addPostOrPage(info: PostOrPageInfoModel): Promise<PostModel | undefined> {
		try {
			const { name, type, ...res } = info;
			const bool = await this._isPostAssetFolder();
			const path = await this.getFullPathByAdd(name, type);

			if (bool && type !== HexoFileType.page) {
				await createFileOrDir(this._root!, path.replace(".md", "/"));
			}

			// 创建 .md 文件
			let handle = await createFileOrDir(this._root!, path);
			if (type === HexoFileType.page) {
				handle = await (<FileSystemDirectoryHandle>handle).getFileHandle("index.md", { create: true }).catch(() => null);
			}

			const frontmatter = hexo.stringifyMd(res);

			const writer = await (<FileSystemFileHandle>handle).createWritable({ keepExistingData: false });
			await writer.write(frontmatter);
			await writer.close();

			return {
				path,
				name,
				...res,
				raw: "",
				md: "",
				frontmatter: {
					...res,
					_content: "",
				},
			};
		} catch (error) {
			return;
		}
	}

	async deleteFile(path: string): Promise<boolean> {
		try {
			const paths = path.split("/");
			const name = paths.pop();
			path = paths.join("/");
			const directoryHandle = await this._getHandle(path);
			if (directoryHandle && name)
				return await directoryHandle
					.removeEntry(name, { recursive: true })
					.then(() => true)
					.catch(() => false);
			else return false;
		} catch (error) {
			return false;
		}
	}

	async savePost(post: PostModel): Promise<boolean> {
		try {
			const postText = configStore.hideFrontMatter
				? hexo.stringifyMd({
						date: post.date,
						title: post.title,
						...post.frontmatter,
						_content: post.md,
				  })
				: post.md;
			return await this.updateFile(post.path, postText);
		} catch (error) {
			return false;
		}
	}

	async publishPost(path: string): Promise<FsResult<string>> {
		const result = {
			state: true,
			data: "",
		};

		const sourceFile = await this._getHandle(path, true);
		const postDir = await this._getPostDirHandle();

		if (sourceFile && postDir) {
			result.state = await conpyFile(sourceFile, postDir);

			const bool = await this._isPostAssetFolder();
			const draftDir = await this._getDraftsDirHandle();
			const paths = path.split("/");
			const fileName = <string>paths.pop();
			const dirName = fileName.replace(".md", "");

			if (bool && draftDir) {
				const draftAssetsDir = await draftDir.getDirectoryHandle(dirName, { create: false }).catch(() => null);
				// 如果存在资源文件夹
				if (draftAssetsDir) {
					const postAssetsDir = await postDir.getDirectoryHandle(dirName, { create: true });
					result.state = result.state && (await copyDirectory(draftAssetsDir, postAssetsDir));

					if (result.state) draftDir?.removeEntry(dirName, { recursive: true });
				}
			}

			if (result.state) draftDir?.removeEntry(fileName, { recursive: false });
			result.data = await this.getFullPathByAdd(fileName, HexoFileType.post);
			return result;
		} else {
			result.state = false;
			return result;
		}
	}

	async unpublishPost(path: string): Promise<FsResult<string>> {
		const result = {
			state: true,
			data: "",
		};
		const sourceFile = await this._getHandle(path, true);
		const draftDir = await this._getDraftsDirHandle();

		if (sourceFile && draftDir) {
			result.state = result.state && (await conpyFile(sourceFile, draftDir));

			const bool = await this._isPostAssetFolder();
			const postDir = await this._getPostDirHandle();
			const paths = path.split("/");
			const fileName = <string>paths.pop();
			const dirName = fileName.replace(".md", "");

			if (bool && postDir) {
				const postAssetsDir = await postDir.getDirectoryHandle(dirName, { create: false }).catch(() => null);
				// 如果存在资源文件夹
				if (postAssetsDir) {
					const draftAssetsDir = await draftDir.getDirectoryHandle(dirName, { create: true });
					result.state = result.state && (await copyDirectory(postAssetsDir, draftAssetsDir));

					if (result.state) postDir?.removeEntry(dirName, { recursive: true });
				}
			}

			if (result.state) postDir?.removeEntry(fileName, { recursive: false });
			result.data = await this.getFullPathByAdd(fileName, HexoFileType.draft);
			return result;
		} else {
			result.state = false;
			return result;
		}
	}

	async isPathExist(path: string): Promise<boolean> {
		return isPathExist(this._root!, path);
	}

	async getFullPathByAdd(name: string, type: HexoFileType): Promise<string> {
		const { config } = await this.getHexoConfig();
		return hexo.getFullPath(name, type, config?.source);
	}

	async transformImgUrl(text: string, path: string): Promise<string> {
		const reg = /(?<=(img[^>]*src="))[^"]*/g;
		const srcs = text.match(reg);
		const imgs: { [k: string]: string } = {};
		if (srcs) {
			const bool = await this._isPostAssetFolder();
			const { config } = await this.getHexoConfig();
			const sourceDir = hexo.getSourcePath(config?.source);

			for (let index = 0; index < srcs.length; index++) {
				const src = srcs[index];
				if (!/^(#|\/\/|http(s)?:)/.test(src)) {
					if (bool && !/$[\\\/]/.test(src)) {
						imgs[src] = await this.getImageUrl(path.replace(".md", "/") + src);
					}

					if (!imgs[src]) {
						imgs[src] = await this.getImageUrl(sourceDir + src);
					}
				}
			}
			return text.replace(reg, (str) => imgs[str] || str);
		} else {
			return text;
		}
	}
}

export default <Plugin>{
	name: "local-file-system",
	register(ctx) {
		ctx.fs.register(FileStoreTypeEnum.Local, LocalFileSystem);
	},
};
