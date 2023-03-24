export type Menus = { [id: string]: StatusMenu };
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
export const getMenus = (position: StatusMenu["position"]): StatusMenu[] => {
	const menus: Menus = {};
	tappers.forEach((tap) => tap(menus));
	return Object.values(menus)
		.filter((x) => x.position === position)
		.sort((a, b) => (a.order || 0) - (b.order || 0));
};
