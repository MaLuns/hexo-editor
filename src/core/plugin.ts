import { getLogger } from "@/utils";
import type { Ctx } from "@/core/context";

export interface Plugin {
	name: string;
	register?: (ctx: Ctx) => void;
}

const logger = getLogger("plugin");
const plugins: { [name: string]: Plugin } = {};

/**
 * 插件注册
 * @param plugin
 * @param ctx
 * @returns
 */
export function register(plugin: Plugin, ctx: Ctx) {
	logger.debug("register", plugin);

	if (plugins[plugin.name]) {
		logger.error(`Plugin [${plugin.name}] already registered.`);
		return;
	}

	plugins[plugin.name] = plugin;
	plugin.register && plugin.register(ctx);
}

/**
 * 插件初始化
 * @param plugins
 * @param ctx
 */
export function init(plugins: Plugin[], ctx: Ctx) {
	logger.debug("init");

	plugins.forEach((plugin) => {
		register(plugin, ctx);
	});

	window.registerPlugin = (plugin: Plugin) => register(plugin, ctx);
}
