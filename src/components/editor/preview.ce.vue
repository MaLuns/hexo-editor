<script lang="ts">
import { registerHook } from "@/core/hook";
import { regexRules, throttle } from "@/utils";
import { h } from "vue";
import defaultCss from "./pre/index.less?inline";

const siblings = (ele: any, selector: string) => {
	return [...ele.parentNode.children].filter((child) => {
		if (selector) {
			return child !== ele && child.matches(selector);
		}
		return child !== ele;
	});
};

const preWarpWef = ref<HTMLDivElement>();
const catchScroll: { [k: string]: number } = {};

export default {
	props: {
		viewId: {
			type: String,
			default: "",
		},
		html: {
			type: String,
			default: "",
		},
		theme: {
			type: String,
			default: "light",
		},
		preStyle: {
			type: String,
			default: "",
		},
		preTag: {
			type: String,
			default: "",
		},
		preClass: {
			type: String,
			default: "",
		},
	},
	setup(props) {
		const scrollFun = throttle(function () {
			catchScroll[props.viewId] = preWarpWef.value!.scrollTop;
		}, 300);

		onMounted(() => {
			preWarpWef.value && preWarpWef.value.addEventListener("scroll", scrollFun);

			registerHook("TOC_LIST_CLICK", (e) => {
				if (preWarpWef.value) {
					const root = preWarpWef.value;
					const trag = root.querySelector<HTMLElement>(`#${e.id}`);
					if (trag) {
						root.scrollTo({
							top: trag.offsetTop - trag.offsetHeight - 30,
							left: 0,
							behavior: "smooth",
						});
					}
				}
			});
		});

		onUnmounted(() => {
			preWarpWef.value && preWarpWef.value.removeEventListener("scroll", scrollFun);
		});

		const style = computed(() => {
			if (regexRules.url.test(props.preStyle)) {
				return h("link", { rel: "stylesheet", href: props.preStyle });
			}
			if (props.preStyle) {
				return h("style", null, props.preStyle);
			}
			return h("style", null, defaultCss);
		});

		return () => [
			style.value,
			h(
				"div",
				{ class: ["pre-wrap", props.theme], ref: preWarpWef },
				h(props.preTag || "div", {
					class: [props.preClass || "trm-publication", props.theme],
					innerHTML: props.html,
				})
			),
		];
	},
	watch: {
		html: function () {
			this.init();
		},
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			if (preWarpWef.value) {
				preWarpWef.value.scrollTo({
					top: catchScroll[this.viewId] || 0,
					left: 0,
					behavior: "auto",
				});
			}
			this.$nextTick(() => {
				this.InitTabs();
			});
		},
		InitTabs() {
			const root = this.$el.parentNode;
			root.querySelectorAll(".trm-tabs .trm-tab > button").forEach(function (item: any) {
				item.addEventListener("click", function () {
					const $this = item;
					const $tabItem = $this.parentNode;

					if (!$tabItem.classList.contains("active")) {
						const $tabContent = $tabItem.parentNode.nextElementSibling;
						const $siblings = siblings($tabItem, ".active")[0];
						$siblings && $siblings.classList.remove("active");
						$tabItem.classList.add("active");
						const tabId = $this.getAttribute("data-href").replace("#", "");
						const childList = [...$tabContent.children];
						childList.forEach((item) => {
							if (item.id === tabId) item.classList.add("active");
							else item.classList.remove("active");
						});
					}
				});
			});
		},
	},
};
</script>
<style lang="less">
.pre-wrap {
	box-sizing: border-box;
	overflow-y: auto;
	overflow-x: hidden;
	height: calc(100% - 20px);
	padding: 20px;
	margin: 10px;
	font-weight: 500;
}

@import "./pre/highlight.less";
</style>
