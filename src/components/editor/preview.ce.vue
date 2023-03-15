<script lang="ts">
import { registerHook } from "@/core/hook";
import { throttle } from "@/utils";
import { h } from "vue";

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
		links: {
			type: Array,
			default: () => [],
		},
		theme: {
			type: String,
			default: "light",
		},
		tag: {
			type: String,
			default: "div",
		},
		preClass: {
			type: String,
			default: "trm-publication",
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

		return () => [
			props.links.length ? props.links.map((href) => h("link", { rel: "stylesheet", href })) : null,
			h(
				"div",
				{
					class: ["pre-wrap", props.theme],
					ref: preWarpWef,
				},
				h(props.tag, {
					class: [props.preClass, props.theme],
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
@import url(./pre/index.less);
</style>
