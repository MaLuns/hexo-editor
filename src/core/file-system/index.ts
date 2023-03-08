import type AbstractFileSystem from "./abstract-file-system";

type Instance = new () => AbstractFileSystem;

class ConcreteFactory {
	private static singletons: Record<string, AbstractFileSystem> = {};
	private static instances: {
		[k: string]: Instance;
	} = {};

	public static register(i: Instance) {
		ConcreteFactory.instances[i.name] = i;
	}

	public static getInstance(key: keyof typeof ConcreteFactory.instances): AbstractFileSystem {
		if (!ConcreteFactory.singletons[key]) {
			const instance = ConcreteFactory.instances[key];
			ConcreteFactory.singletons[key] = new instance();
		}
		return ConcreteFactory.singletons[key];
	}
}

export default ConcreteFactory;
