export type MenuItem =
	| {
			id: string;
			title: string;
			type: "normal";
			subTitle?: string;
			disabled?: boolean;
			hidden?: boolean | ComputedRef<boolean> | Ref<boolean>;
			checked?: boolean | ComputedRef<boolean> | Ref<boolean>;
			onClick?: (item: MenuItem, menu: Menu) => void;
	  }
	| {
			type: "separator";
			hidden?: boolean;
	  };

export interface Menu {
	id: string;
	title?: string | Component | Ref<string>;
	tips?: string; // not available for vue component title
	icon?: Component; // not available for vue component title
	hidden?: boolean | ComputedRef<boolean> | Ref<boolean>;
	position: "left" | "right" | "center";
	order?: number;
	list?: MenuItem[];
	onClick?: (menu: Menu) => void;
	onMousedown?: (menu: Menu) => void;
}

export type Menus = { [id: string]: Menu };
export type MenuTapper = (menus: Menus) => void;

const tappers: MenuTapper[] = [];

/**
 * 添加一个状态栏
 * @param tapper
 */
export const tapMenus = (tapper: MenuTapper) => {
	tappers.push(tapper);
};

/**
 * 获取状态栏
 * @param position
 * @returns
 */
export const getMenus = (position: Menu["position"]): Menu[] => {
	const menus: Menus = {};
	tappers.forEach((tap) => tap(menus));
	return Object.values(menus)
		.filter((x) => x.position === position)
		.sort((a, b) => (a.order || 0) - (b.order || 0));
};
