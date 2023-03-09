import type { FileStoreTypeEnum } from "@/enums";
import type AbstractFileSystem from "./abstract-file-system";

type Instance = new () => AbstractFileSystem;

class ConcreteFactory {
	private static singletons: Record<string, AbstractFileSystem> = {};
	private static instances: {
		[k in FileStoreTypeEnum]?: Instance;
	} = {};

	public static register(key: FileStoreTypeEnum, i: Instance) {
		ConcreteFactory.instances[key] = i;
	}

	public static getInstance(key: FileStoreTypeEnum): AbstractFileSystem {
		if (!ConcreteFactory.singletons[key]) {
			const instance = ConcreteFactory.instances[key]!;
			ConcreteFactory.singletons[key] = new instance();
		}
		return ConcreteFactory.singletons[key];
	}
}

export default ConcreteFactory;
