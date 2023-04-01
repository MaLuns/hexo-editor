import { createI18n } from "vue-i18n";
import zhCN, { type BaseLanguage } from "@/i18n/languages/zh-CN";
import en from "@/i18n/languages/en";

const languages = {
	"zh-CN": zhCN,
	en: en,
};
export type Flat<T extends Record<string, any>, P extends string = ""> = {
	[K in keyof T as T[K] extends string ? (K extends string ? (P extends "" ? K : `${P}.${K}`) : never) : K extends string ? keyof Flat<T[K], P extends "" ? K : `${P}.${K}`> : never]: never;
};
export type MsgPath = keyof Flat<BaseLanguage>;

const i18n = createI18n({
	locale: "zh-CN",
	fallbackLocale: "zh-CN",
	messages: languages,
});

export const t = (key: MsgPath) => i18n.global.t(key);
export const tRef = (key: MsgPath) => computed(() => i18n.global.t(key));

export default i18n;

/* import type { App } from "vue";
import zhCN, { type BaseLanguage } from "@/i18n/languages/zh-CN";
import en from "@/i18n/languages/en";
import { getDataPath, strFormat } from "@/utils";

const languages = {
	"zh-CN": zhCN,
	en: en,
};

export type Flat<T extends Record<string, any>, P extends string = ""> = {
	[K in keyof T as T[K] extends string ? (K extends string ? (P extends "" ? K : `${P}.${K}`) : never) : K extends string ? keyof Flat<T[K], P extends "" ? K : `${P}.${K}`> : never]: never;
};
export type MsgPath = keyof Flat<BaseLanguage>;
export type Language = keyof typeof languages;

const locale = ref<Language>("zh-CN");

export const getText = (data: Record<string, any>, path: MsgPath, ...args: string[]): string => {
	const text: string = getDataPath(data, path);
	if (args.length < 1) {
		return text;
	}
	return strFormat(text, args);
};

export const t = (lang: Language, path: MsgPath, ...args: string[]) => {
	const language = languages[lang] || zhCN;
	return getText(language, path, ...args);
};

export const setLocale = (lang: Language) => {
	locale.value = lang;
};

export const getLocale = () => {
	return locale.value;
};

export const i18nPlugin = {
	install(app: App) {
		app.config.globalProperties.$t = (path: string, ...args: string[]) => {
			return t(locale.value, <MsgPath>path, ...args);
		};
	},
};
 */
