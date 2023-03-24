<script lang="ts" setup>
import { useThemeVars, type InputInst, type ScrollbarInst } from "naive-ui";
import { getCommands } from "@/core/command";
import { ReturnUpBack } from "@vicons/ionicons5";

const emit = defineEmits(["palette"]);
const themeVars = useThemeVars();
const show = ref<boolean>(false);
const init = ref<boolean>(false);

const commandList: CommandPalette[] = getCommands();

const checkIds = ref([commandList[0].id]);
const inputInstRef = ref<InputInst | null>(null);
const scrollbarRef = ref<ScrollbarInst | null>(null);
const searchVal = ref<string>();

// 获取当前层级列表
const getCurrentList = () => {
	let list = commandList;
	let len = checkIds.value.length - 1;
	len > 0 &&
		checkIds.value.forEach((item, index) => {
			if (index >= len) return;
			list = commandList.find((p) => p.id === item)?.children || [];
		});
	return list;
};

// 获取当前命令
const getCurrentCommand = () => {
	const id = checkIds.value[checkIds.value.length - 1];
	return currentFilterList.value.find((item) => item.id === id);
};

// 当前选择面板路径
const getCurrentLabel = computed(() => {
	const str: string[] = [];
	let list = commandList;
	checkIds.value.forEach((id) => {
		const command = list.find((item) => item.id === id);
		if (command) str.push(command.title);
		if (command?.children) list = command.children;
	});
	return str.length > 1 ? str.join(" / ") : "Type a command or search...";
});

// 当前层级赛选后列
const currentFilterList = computed(() => {
	const searchStr = searchVal.value?.trim();
	const list = getCurrentList();
	return searchStr ? list.filter((item) => item.title.includes(searchStr)) : list;
});

const open = (ids?: string[]) => {
	searchVal.value = "";
	checkIds.value = ids ? ids : [commandList[0].id];
	init.value = true;
	show.value = true;
	nextTick(() => {
		setSelect(0);
		inputInstRef.value?.focus();
	});
};
const close = () => (show.value = false);
const toggle = () => (show.value = !show.value);

// 设置当前选中项
const setSelect = (index: number, behavior?: "smooth" | undefined) => {
	checkIds.value[checkIds.value.length - 1] = currentFilterList.value[index].id;
	scrollbarRef.value?.scrollTo({
		top: index * 41,
		behavior,
	});
};

// 返回上一层
const handleGoBack = () => {
	if (checkIds.value.length > 1) {
		checkIds.value.pop();
		nextTick(() => {
			const id = checkIds.value[checkIds.value.length - 1];
			const index = currentFilterList.value.findIndex((item) => item.id === id);
			setSelect(index);
		});
	} else {
		close();
	}
};

// 触发当前命令
const handleSelectCommand = (item: CommandPalette | undefined) => {
	if (item) {
		if (item.children) {
			searchVal.value = "";
			checkIds.value[checkIds.value.length - 1] = item.id;
			checkIds.value.push(item.children[0].id);
			setSelect(0);
			item.select && item.select(item);
		} else {
			close();
			if (item.handle) item.handle(item);
			else emit("palette", item.id);
		}
	}
};

// 强制聚焦
const handleBlur = () => {
	if (show.value) {
		inputInstRef.value?.focus();
	}
};

// 面板内按键响应
const handleKeyDown = (e: KeyboardEvent) => {
	if (e.defaultPrevented) {
		return;
	}
	let handled = true;

	const id = checkIds.value[checkIds.value.length - 1];
	let lastIndex = currentFilterList.value.findIndex((item) => item.id === id);

	switch (e.code) {
		case "Escape":
			handleGoBack();
			break;
		case "Enter":
			handleSelectCommand(getCurrentCommand());
			break;
		case "ArrowUp":
			lastIndex = lastIndex - 1 < 0 ? currentFilterList.value.length - 1 : lastIndex - 1;
			setSelect(lastIndex, "smooth");
			break;
		case "ArrowDown":
			lastIndex = lastIndex + 1 > currentFilterList.value.length - 1 ? 0 : lastIndex + 1;
			setSelect(lastIndex, "smooth");
			break;
		default:
			handled = false;
			break;
	}

	if (handled) e.preventDefault();
};

provide("command-palette-bar", {
	open,
	close,
	toggle,
	show,
});
</script>
<template>
	<slot></slot>
	<Teleport to="body">
		<template v-if="init">
			<Transition>
				<div v-show="show" @keydown="handleKeyDown">
					<div class="command-mark"></div>
					<div class="command-wrapper">
						<div class="command-header">
							<n-input ref="inputInstRef" v-model:value="searchVal" :placeholder="getCurrentLabel" clearable autofocus size="large" style="--n-height: 50px" :on-blur="handleBlur">
								<template v-if="checkIds.length > 1" #suffix>
									<kbd class="command-palette-commands-key" style="cursor: pointer; padding: 6px 12px; width: auto; font-size: 12px; font-weight: bold" @click="handleGoBack">
										<n-icon :component="ReturnUpBack" :size="16"></n-icon>
										<span style="margin-left: 4px"> Backspace </span>
									</kbd>
								</template>
							</n-input>
						</div>
						<div class="command-body">
							<n-scrollbar ref="scrollbarRef" class="custom-scorll">
								<n-list v-if="currentFilterList.length" hoverable :show-divider="false">
									<n-list-item v-for="item in currentFilterList" :key="item.id" :class="{ active: item.id === checkIds[checkIds.length - 1] }" @click="handleSelectCommand(item)">
										<n-thing>
											<template #header>
												<span>{{ item.title }}</span>
												<span v-if="item.desc" class="title-desc">{{ item.desc }}</span>
											</template>
											<template v-if="item.keybindLabel" #header-extra>
												<kbd v-for="key in item.keybindLabel" :key="key" class="command-palette-commands-key">
													{{ key }}
												</kbd>
											</template>
										</n-thing>
									</n-list-item>
								</n-list>
								<div v-else class="p-40 center">No results found.</div>
							</n-scrollbar>
						</div>
						<div class="command-footer">
							<div class="command-palette-logo">
								<img src="../assets/logo.svg" alt="" width="22" />
							</div>
							<ul class="command-palette-commands">
								<li>
									<kbd class="command-palette-commands-key">
										<svg width="15" height="15" aria-label="Enter key" role="img">
											<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"></path></g>
										</svg>
									</kbd>
									<span class="command-palette-Label">to select</span>
								</li>
								<li>
									<kbd class="command-palette-commands-key">
										<svg width="15" height="15" aria-label="Arrow down" role="img">
											<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3"></path></g>
										</svg>
									</kbd>
									<kbd class="command-palette-commands-key">
										<svg width="15" height="15" aria-label="Arrow up" role="img">
											<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3"></path></g>
										</svg>
									</kbd>
									<span class="command-palette-Label">to navigate</span>
								</li>
								<li>
									<kbd class="command-palette-commands-key">
										<svg width="15" height="15" aria-label="Escape key" role="img">
											<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
												<path
													d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"
												></path>
											</g>
										</svg>
									</kbd>
									<span class="command-palette-Label">to close</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</Transition>
		</template>
	</Teleport>
</template>
<style lang="less" scoped>
.command-wrapper {
	user-select: none;
	position: fixed;
	top: 80px;
	left: 0;
	right: 0;
	margin: 0 auto;
	width: 50%;
	max-width: 560px;
	background-color: v-bind("themeVars.bodyColor");
	z-index: 999;
	border-radius: 6px;
	overflow: hidden;

	.command-header {
		padding: 12px;
		box-shadow: 0 1px v-bind("themeVars.tabColor"), 0 3px 6px #45629b1f;
		border-bottom: 1px solid v-bind("themeVars.borderColor");
	}

	.command-body {
		padding: 12px;
		height: fit-content;
		max-height: 300px;

		.n-list-item {
			cursor: pointer;
			padding: 8px 12px;

			& + .n-list-item {
				margin-top: 3px;
			}

			&.active,
			&:hover {
				background-color: v-bind("themeVars.primaryColor");
				color: #eee;
				:deep(.n-thing-header) {
					/* .n-thing-header__extra, */
					.n-thing-header__title {
						color: #eee;
					}
				}
			}

			&:hover {
				background-color: v-bind("themeVars.primaryColorHover");
			}

			:deep(.n-thing-header) {
				margin-bottom: 0;
				.n-thing-header__title {
					font-size: v-bind("themeVars.fontSizeSmall");
					display: flex;
					justify-content: space-between;
					width: 100%;
					.title-desc {
						font-size: 10px;
						opacity: 0.9;
					}
				}
				.n-thing-header__extra {
					font-size: v-bind("themeVars.fontSizeMini");
					display: flex;
					.command-palette-commands-key {
						padding: 2px 4px;
					}
				}
			}
		}

		:deep(.custom-scorll) {
			max-height: 300px;
		}
	}

	.command-footer {
		height: 44px;
		padding: 0 12px;
		box-shadow: 0 -1px v-bind("themeVars.tabColor"), 0 -3px 6px #45629b1f;
		border-top: 1px solid v-bind("themeVars.borderColor");
		background-color: v-bind("themeVars.tabColor");
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 12px;

		.command-palette-logo img {
			vertical-align: middle;
		}
		.command-palette-commands {
			display: flex;
			list-style: none;
			margin: 0;
			padding: 0;

			li {
				display: flex;
				align-items: center;
				margin-left: 0.8em;
			}
		}

		.command-palette-commands-key {
			margin-left: 0;
			margin-right: 0.4em;
			width: 20px;
		}
	}
}

.command-palette-commands-key {
	align-items: center;
	background: v-bind("themeVars.tagColor");
	border-radius: 2px;
	display: flex;
	height: 18px;
	justify-content: center;
	margin-left: 0.4em;
	padding: 0 0 1px;
	border: 0;
}

.command-mark {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	opacity: 0.2;
	background-color: v-bind("themeVars.textColor2");
}

.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
