import type { Plugin } from "@/core/plugin";
import { createDiscreteApi, NButton, NDivider } from "naive-ui";
import { InfoSquare } from "@vicons/tabler";

import { author, version, homepage } from "../../package.json";
import logo from "@/assets/logo.svg";

const dialog = createDiscreteApi(["dialog"]);

export default <Plugin>{
	name: "status-bar-help",
	register: (ctx) => {
		ctx.statusBar.tapMenus((menus) => {
			menus["status-bar-help"] = {
				id: "status-bar-help",
				position: "right",
				title: "帮助",
				icon: InfoSquare,
				list: [
					{
						id: "show-premium",
						title: "语法参考",
						type: "normal",
						onClick: () => {},
					},
					{
						id: "show-premium",
						title: "关于 Hexo-Editor",
						type: "normal",
						onClick: () => {
							dialog.dialog.create({
								showIcon: false,
								closable: false,
								autoFocus: false,
								style: {
									textAlign: "center",
								},
								content: () =>
									h("div", { clas: "about" }, [
										h("img", {
											src: logo,
											class: "logo",
											alt: "logo",
											width: "80",
										}),
										h("div", { class: "text" }, [
											h(
												"h3",
												{
													class: "m-0",
												},
												"一款在线的 Hexo 编辑器"
											),
											h(
												"p",
												{
													class: "m-0 p-0",
												},
												[
													h(
														NButton,
														{
															text: true,
															tag: "a",
															href: homepage,
															target: "_blank",
														},
														"Gitee"
													),
													h(NDivider, { vertical: true }),
													h(
														NButton,
														{
															text: true,
															tag: "a",
															href: homepage,
															target: "_blank",
														},
														"Github"
													),
													h(NDivider, { vertical: true }),
													version,
												]
											),
											h(
												"p",
												{
													class: "m-0 p-0",
												},
												[
													"CopyRight © 2018 - 2023  ",
													h(
														NButton,
														{
															text: true,
															tag: "a",
															href: author.url,
															target: "_blank",
														},
														author.name
													),
												]
											),
										]),
									]),
							});
						},
					},
				],
			};
		});
	},
};