export const regexRules = {
	fileName: /^[^\\/:*?"<>|\s]+$/i,
};

/**
 * 时间格式化
 * @param date
 * @param format
 * @returns
 */
export const formatDate = (date: Date, format: string): string => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	const map: Record<string, number> = {
		YYYY: year,
		MM: month,
		DD: day,
		hh: hour,
		mm: minute,
		ss: second,
	};

	return format.replace(/YYYY|MM|DD|hh|mm|ss/g, (match: string) => {
		const value = map[match] + "";
		return value !== undefined ? (value.length > 1 ? value : (Array(2).fill("0").join("") + value).slice(-2)) : match;
	});
};

/**
 * 防抖
 * @param func
 * @param wait
 * @returns
 */
export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
	let timeout: ReturnType<typeof setTimeout>;

	return function (this: any, ...args: Parameters<T>): void {
		const later = () => {
			clearTimeout(timeout);
			func.apply(this, args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

/**
 * 节流
 * @param func
 * @param wait
 * @returns
 */
export const throttle = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
	let timeout: ReturnType<typeof setTimeout> | null;

	return function (this: any, ...args: Parameters<T>): void {
		if (!timeout) {
			timeout = setTimeout(() => {
				timeout = null;
				func.apply(this, args);
			}, wait);
		}
	};
};

export const htmlTag = (tag: string, attrs: any, text?: string | undefined) => {
	let result = `<${tag}`;
	for (const key in attrs) {
		if (Object.prototype.hasOwnProperty.call(attrs, key)) {
			const element = attrs[key];
			result += ` ${key}="${element}"`;
		}
	}

	if (text == undefined) result += ">";
	else result += `>${text}</${tag}>`;
	return result;
};

/**
 * 日志打印
 * @param subject
 * @returns
 */
export function getLogger(subject: string) {
	const logger =
		(level: string) =>
		(...args: any) => {
			const time = `${new Date().toLocaleString()}.${Date.now() % 1000}`;
			(console as any)[level](`[${time}] [${level}] ${subject} >`, ...args);
		};

	return {
		debug: import.meta.env.MODE === "development" ? logger("debug") : () => 0,
		log: logger("log"),
		info: logger("info"),
		warn: logger("warn"),
		error: logger("error"),
	};
}

/**
 * 对象合并
 * @param target
 * @param source
 * @returns
 */
export const deepMerge = <T>(target: T, source: T): T => {
	// 判断是否都是对象类型
	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key]) && isObject(target[key])) {
				// 递归合并子对象
				deepMerge(target[key], source[key]);
			} else {
				if (Reflect.getOwnPropertyDescriptor(source as unknown as object, key)) {
					// 直接复制属性值
					target[key] = source[key];
				}
			}
		}
	}
	return target;
};

/**
 * 是否是对象
 * @param obj
 * @returns
 */
export const isObject = (obj: any): boolean => Object.prototype.toString.call(obj) === "[object Object]";

/**
 * 格式化字符串
 * @param str
 * @param vals
 * @returns
 */
export const strFormat = (str: string, ...vals: any[]): string => vals.reduce((s, v, i) => s.replace(new RegExp("\\{" + i + "\\}", "g"), v), str);
