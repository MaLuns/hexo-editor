export const regexRules = {
    fileName: /^[^\\/:*?"<>|\s]+$/i
}

export const formatDate = (date: Date, format: string): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const map: Record<string, number> = {
        'YYYY': year,
        'MM': month,
        'DD': day,
        'hh': hour,
        'mm': minute,
        'ss': second
    };

    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, (match: string) => {
        const value = map[match] + '';
        return value !== undefined ?
            (value.length > 1 ? value : (Array(2).fill('0').join('') + value).slice(-2))
            : match;
    });
}

/**
 * 防抖
 * @param func 
 * @param wait 
 * @returns 
 */
export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void => {
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: any, ...args: Parameters<T>): void {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流
 * @param func 
 * @param wait 
 * @returns 
 */
export const throttle = <T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void => {
    let timeout: ReturnType<typeof setTimeout> | null;

    return function (this: any, ...args: Parameters<T>): void {
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(this, args);
            }, wait);
        }
    };
}


export const htmlTag = (tag: string, attrs: any, text?: string | undefined) => {
    let result = `<${tag}`;
    for (const key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
            const element = attrs[key];
            result += ` ${key}="${element}"`
        }
    }

    if (text == undefined) result += '>';
    else result += `>${text}</${tag}>`;
    return result;
}

export const readDirectory = async (directorys: any) => {
    let dir: Array<any> = []
    for await (const [key, value] of directorys.entries()) {
        if (value.kind === 'file') {
            dir.push(value)
        } else {
            value.children = await readDirectory(value)
            dir.push(value)
        }
    }
    return dir;
}