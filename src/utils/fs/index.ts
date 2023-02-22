import LocalFileSystem from "./core/LocalFileSystem";

type FSType = InstanceType<typeof LocalFileSystem>;

class ConcreteFactory {
    private static singletons: Record<string, FSType> = {};
    private static instances = {
        LocalFileSystem,
    };

    public static getInstance(key: keyof typeof ConcreteFactory.instances): FSType {
        if (!ConcreteFactory.singletons[key]) {
            const instance = ConcreteFactory.instances[key];
            ConcreteFactory.singletons[key] = new instance();
        }
        return ConcreteFactory.singletons[key];
    }
}

export default ConcreteFactory;
