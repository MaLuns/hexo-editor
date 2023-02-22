<script lang="ts">
import { h } from "vue";
const siblings = (ele: any, selector: string) => {
	return [...ele.parentNode.children].filter((child) => {
		if (selector) {
			return child !== ele && child.matches(selector);
		}
		return child !== ele;
	});
};
export default {
	props: {
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
		return () => [
			props.links.length
				? props.links.map((href) =>
						h("link", {
							rel: "stylesheet",
							href,
						})
				  )
				: null,
			h(
				"div",
				{ class: ["pre-wrap", props.theme] },
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
