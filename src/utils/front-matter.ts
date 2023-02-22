import yaml from "js-yaml";

const optionalByteOrderMark = "\\ufeff?";
const pattern = "^(" + optionalByteOrderMark + "(= yaml =|---)" + "$([\\s\\S]*?)" + "^(?:\\2|\\.\\.\\.)\\s*" + "$" + "" + "(?:\\n)?)";

// NOTE: If this pattern uses the 'g' flag the `regex` variable definition will
// need to be moved down into the functions that use it.
const regex = new RegExp(pattern, "m");

function split(string: string) {
    var match = regex.exec(string);
    if (!match) {
        return {
            data: undefined,
            content: string,
        };
    }
    const yaml = match[match.length - 1].replace(/^\s+|\s+$/g, "");
    return {
        data: yaml,
        content: string.replace(match[0], ""),
        separator: match[2] || "",
    };
}

function parse(str: string, options?: yaml.LoadOptions) {
    if (typeof str !== "string") throw new TypeError("str is required!");

    const splitData = split(str);
    const raw = splitData.data;

    if (!raw) return { _content: str };

    let data: any;

    if (splitData.separator.startsWith(";")) {
        data = parseJSON(raw);
    } else {
        data = parseYAML(raw, options);
    }

    if (!data) return { _content: str };

    // Convert timezone
    Object.keys(data).forEach((key) => {
        const item = data[key];

        if (item instanceof Date) {
            data[key] = new Date(item.getTime() + item.getTimezoneOffset() * 60 * 1000);
        }
    });

    data._content = splitData.content;
    return data;
}

function parseYAML(str: string, options: yaml.LoadOptions | undefined) {
    const result = yaml.load(escapeYAML(str), options);
    if (typeof result !== "object") return;

    return result;
}

function parseJSON(str: string) {
    try {
        return JSON.parse(`{${str}}`);
    } catch (err) {
        return; // eslint-disable-line
    }
}

function escapeYAML(str: string) {
    if (typeof str !== "string") throw new TypeError("str is required!");

    return str.replace(/\n(\t+)/g, (match, tabs) => {
        let result = "\n";

        for (let i = 0, len = tabs.length; i < len; i++) {
            result += "  ";
        }

        return result;
    });
}

function stringify(
    obj: { [k: string]: any; _content?: string | undefined },
    options: yaml.DumpOptions & {
        mode?: string;
        prefixSeparator?: boolean;
        separator?: string;
    } = {}
) {
    if (!obj) throw new TypeError("obj is required!");

    const { _content: content = "" } = obj;
    delete obj._content;

    if (!Object.keys(obj).length) return content;

    const { mode, prefixSeparator } = options;
    const separator = options.separator || (mode === "json" ? ";;;" : "---");
    let result = "";

    if (prefixSeparator) result += `${separator}\n`;

    if (mode === "json") {
        result += stringifyJSON(obj);
    } else {
        result += stringifyYAML(obj, options);
    }

    result += `${separator}\n${content}`;

    return result;
}

function stringifyYAML(obj: any, options?: yaml.DumpOptions | undefined) {
    const keys = Object.keys(obj);
    const data: { [k: string]: any } = {};
    const nullKeys = [];
    const dateKeys = [];
    let key, value, i, len;

    for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        value = obj[key];

        if (value == null) {
            nullKeys.push(key);
        } else if (value instanceof Date) {
            dateKeys.push(key);
        } else {
            data[key] = value;
        }
    }

    let result = yaml.dump(data, options);

    if (dateKeys.length) {
        for (i = 0, len = dateKeys.length; i < len; i++) {
            key = dateKeys[i];
            result += `${key}: ${formatDate(obj[key])}\n`;
        }
    }

    if (nullKeys.length) {
        for (i = 0, len = nullKeys.length; i < len; i++) {
            result += `${nullKeys[i]}:\n`;
        }
    }

    return result;
}

function stringifyJSON(obj: any) {
    return (
        JSON.stringify(obj, null, "  ")
            // Remove indention
            .replace(/\n {2}/g, () => "\n")
            // Remove prefixing and trailing braces
            .replace(/^{\n|}$/g, "")
    );
}

function doubleDigit(num: number) {
    return (Array(2).fill("0").join("") + num).slice(-2);
}

function formatDate(date: Date) {
    return `${date.getFullYear()}-${doubleDigit(date.getMonth() + 1)}-${doubleDigit(date.getDate())} ${doubleDigit(date.getHours())}:${doubleDigit(date.getMinutes())}:${doubleDigit(date.getSeconds())}`;
}

export default {
    parse,
    split,
    escape: escapeYAML,
    stringify,
};
