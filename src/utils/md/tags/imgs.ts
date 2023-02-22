import { htmlTag } from "@/utils";

const rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\w]*))?)/;
const rMeta = /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/;

export default (args: any[]) => {
	const classMap = ["trm-light-icon", "trm-dark-icon"];
	const classes: string[] = [];
	const attrs = [];
	const srcs = [];
	let width: any, height: any, title: any, alt: any;

	// Find image URL and class name
	while (args.length > 0) {
		const item = args.shift();
		if (rUrl.test(item) || item.startsWith("/")) {
			srcs.push(item);
		} else {
			if (srcs.length < 1) {
				classes.push(item);
			} else {
				attrs.push(item);
			}
		}
	}

	// Find image width and height
	if (attrs && attrs.length) {
		if (!/\D+/.test(attrs[0])) {
			width = attrs.shift();

			if (attrs.length && !/\D+/.test(attrs[0])) {
				height = attrs.shift();
			}
		}

		const match = rMeta.exec(attrs.join("'"));

		// Find image title and alt
		if (match != null) {
			alt = match[1];
			title = match[2];
		}
	}

	if ([].length === 1) {
		return htmlTag("img", {
			src: srcs[0],
			class: classes.join(" "),
			width,
			height,
			title,
			alt,
		});
	} else {
		return srcs
			.map((src, index) => {
				return htmlTag("img", {
					class: `${classes.join(" ")} ${classMap[index] || ""}`,
					src,
					width,
					height,
					title,
					alt,
				});
			})
			.join(" ");
	}
};
