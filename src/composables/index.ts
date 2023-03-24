import type { MessageReactive } from "naive-ui";
/**
 * 加载状态
 * @returns
 */
export const useLoading = () => {
	const message = useMessage();
	let messageReactive: MessageReactive | null = null;

	const endLoading = () => {
		if (messageReactive) {
			messageReactive.destroy();
			messageReactive = null;
		}
	};

	onBeforeUnmount(endLoading);

	return {
		endLoading,
		startLoading(title: string) {
			if (messageReactive) {
				messageReactive.content = title;
			} else {
				messageReactive = message.loading(title, { duration: 0 });
			}
		},
	};
};

/**
 * 事件绑定
 * @param target
 * @param event
 * @param callback
 */
export const useEventListener = (target: any, event: string, callback: Function) => {
	target.addEventListener(event, callback);
	onUnmounted(() => target.removeEventListener(event, callback));
};

/**
 * 获取父级高度
 * @param min
 * @returns
 */
export const useAutoParentHeight = (min: string) => {
	const proxy = getCurrentInstance()?.proxy;
	if (proxy?.$el && proxy?.$el.parentElement) {
		return proxy?.$el.parentElement.clientHeight + "px";
	}
	return min;
};

/**
 * 获取可使用高度
 * @param reduceHeight
 * @returns
 */
export const useWindowResize = (reduceHeight: number) => {
	const data = ref(`${window.innerHeight - reduceHeight}px`);
	useEventListener(window, "resize", () => {
		data.value = `${window.innerHeight - reduceHeight}px`;
	});
	return data;
};

/**
 * 右键事件坐标
 * @param target
 * @returns
 */
export const useContextMenuXY = (target: HTMLElement) => {
	const xRef = ref(0);
	const yRef = ref(0);
	const showRef = ref(false);

	useEventListener(target, "contextmenu", (e: MouseEvent) => {
		e.preventDefault();
		showRef.value = false;
		nextTick().then(() => {
			showRef.value = true;
			xRef.value = e.clientX;
			yRef.value = e.clientY;
		});
	});

	return {
		show: showRef,
		x: xRef,
		y: yRef,
	};
};

/**
 * 滚动
 * @param target 被滚动元素
 * @param type 滚动方向
 * @returns
 */
export const useAutoScroll = (target: HTMLElement, type: "x" | "y") => {
	const parent = target.parentElement;
	const top = ref(false);
	const bottom = ref(false);
	const left = ref(false);
	const right = ref(false);
	let scrollTo: Function = () => {};

	if (parent) {
		let t = 0; //当前偏移位置

		/**
		 * 设置偏移
		 * @param el 父容器
		 * @param num 偏移位置
		 */
		const setTranslate = (el: HTMLElement, num: number) => {
			const parentWidth = parent.clientWidth; // 滚动容器-宽度
			const parentHeight = parent.clientHeight; // 滚动容器-高度
			const w = el.clientWidth;
			const h = el.clientHeight;

			// x 轴
			if (type === "x") {
				const max = Math.max(w - parentWidth, 0);
				t = Math.min(Math.max(0, num), max);
				left.value = t === 0;
				right.value = t === max;
				el.style.transform = `translateX(-${t}px)`;
			} else {
				// y 轴
				const max = Math.max(h - parentHeight, 0);
				t = Math.min(Math.max(0, num), h - parentHeight);
				top.value = t === 0;
				bottom.value = t === max;
				el.style.transform = `translateY(-${t}px)`;
			}
		};

		scrollTo = (select: string) => {
			const parentWidth = parent.clientWidth; // 滚动容器-宽度
			const parentHeight = parent.clientHeight; // 滚动容器-高度
			const w = target.clientWidth;
			const h = target.clientHeight;

			const toEl = target.querySelector(select) as HTMLElement;
			if (toEl) {
				// 节点 偏移位置
				const l = type === "x" ? toEl.offsetLeft : toEl.offsetTop;
				// 可视区域-结束位置
				const region = t + (type === "x" ? parentWidth : parentHeight);
				// 可偏移最大长度
				const max = type === "x" ? Math.max(w - parentWidth, 0) : Math.max(h - parentHeight, 0);
				// 节点在可视区域内
				if (l > t && l < region && l < max) return;
				setTranslate(target, l);
			}
		};

		useEventListener(target, "wheel", function (e: WheelEvent) {
			e.preventDefault();
			const currentTarget = e.currentTarget as HTMLElement;
			t += e.deltaY > 0 ? 100 : -100;

			setTranslate(currentTarget, t);
		});
	}

	return {
		top,
		bottom,
		left,
		right,
		scrollTo,
	};
};

/**
 * 获取命令面板
 * @returns
 */
export const useCommandPaletteBar = (): { open: Function; close: Function; show: Ref<boolean> } => {
	const api = inject("command-palette-bar", null);
	if (api === null) {
		throw new Error(`[search-bar]: No outer <search-bar /> founded.`);
	}
	return api;
};
