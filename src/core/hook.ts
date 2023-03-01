export const container: Record<string, any[]> = {};

export type HookType = keyof HookTypes;
export type HookFun<T> = (arg: T) => boolean | void | Promise<boolean | void>;

export type Hook<T> = {
	fun: HookFun<T>;
	once: boolean;
};

export const get = <T extends HookType>(type: T) => {
	return [...(container[type] || [])];
};

export const registerHook = <T extends HookType>(type: T, fun: HookFun<HookTypes[T]>, once = false) => {
	if (!container[type]) {
		container[type] = [];
	}
	container[type].push({ fun, once });
};

export const removeHook = <T extends HookType>(type: T, fun: HookFun<HookTypes[T]>) => {
	const when = (item: any) => item.fun === fun;

	if (container[type]) {
		const items = container[type];
		for (let i = items.length - 1; i >= 0; i--) {
			if (when(items[i])) {
				items.splice(i, 1);
			}
		}
	}
};

export const removeAll = <T extends HookType>(type: T) => {
	container[type] = [];
};

export const triggerHook = async <T extends HookType>(type: T, arg?: HookTypes[T], options?: { breakable?: boolean; ignoreError?: boolean }) => {
	const items: Hook<any>[] = get(type);
	for (const { fun, once } of items) {
		once && removeHook<any>(type, fun);
		try {
			if (options?.breakable) {
				if (await fun(arg)) {
					return true;
				}
			} else {
				fun(arg);
			}
		} catch (error) {
			if (options?.ignoreError) {
				console.warn("triggerHook", error);
			} else {
				throw error;
			}
		}
	}

	if (options?.breakable) {
		return false;
	}
};
