import type { FileStoreTypeEnum } from "@/enums";
import type AbstractFileSystem from "./abstract-file-system";

type Instance = new () => AbstractFileSystem;

class ConcreteFactory {
	private static singletons: Record<string, AbstractFileSystem> = {};
	private static instances: {
		[k in FileStoreTypeEnum]?: Instance;
	} = {};

	/**
	 *  注册 FileSystem 类型
	 * @param key FS 类型
	 * @param i  FS类
	 */
	public static register(key: FileStoreTypeEnum, i: Instance) {
		ConcreteFactory.instances[key] = i;
	}

	/**
	 * 获取 FileSystem 实例
	 * @param key FS 类型
	 * @returns
	 */
	public static getInstance(key: FileStoreTypeEnum): AbstractFileSystem {
		if (!ConcreteFactory.singletons[key]) {
			const instance = ConcreteFactory.instances[key]!;
			ConcreteFactory.singletons[key] = new instance();
		}
		return ConcreteFactory.singletons[key];
	}
}

export default ConcreteFactory;
