<script lang="ts" setup>
import type { TooltipProps } from "naive-ui";
import { siderPage } from "@/router";
import { AlertCircle, LogoMarkdown } from "@vicons/ionicons5";

const router = useRouter();
const layoutAboutRef = ref();
const layoutHelpRef = ref();
const data = reactive({
    active: 0,
    pageNavs: siderPage.map((item) => {
        return {
            name: <string>item.name,
            icon: <Component>item?.meta?.icon,
            tips: <string>item?.meta?.tips,
        };
    }),
    helpNavs: [
        {
            icon: markRaw(LogoMarkdown),
            tips: "Markdown 参考",
            key: "markdown",
        },
        {
            icon: markRaw(AlertCircle),
            tips: "关于",
            key: "about",
        },
    ],
});

const handleCheckNav = (index: number) => {
    data.active = index;
    let nav = data.pageNavs[index];
    if (nav.name) {
        router.push({
            name: nav.name,
        });
    }
};

const handleCheckHelpNav = (item: any) => {
    if (item.key === "about") {
        layoutAboutRef.value.show();
    } else if (item.key === "markdown") {
        layoutHelpRef.value.show();
    }
};

type TooltipThemeOverrides = NonNullable<TooltipProps["themeOverrides"]>;
const tooltipThemeOverrides: TooltipThemeOverrides = {
    color: "#fff",
    textColor: "#000",
    peers: {
        Popover: {
            spaceArrow: "20px",
        },
    },
};
</script>
<template>
    <div class="layout-sider">
        <ul class="layout-sider__item">
            <li v-for="(item, index) in data.pageNavs" class="layout-sider__item-nav" :class="{ active: data.active === index }" @click="handleCheckNav(index)">
                <n-tooltip placement="right" trigger="hover" :theme-overrides="tooltipThemeOverrides">
                    <template #trigger>
                        <n-icon size="22" :component="item.icon"> </n-icon>
                    </template>
                    {{ item.tips }}
                </n-tooltip>
            </li>
        </ul>
        <ul class="layout-sider__item">
            <li class="layout-sider__item-nav" v-for="item in data.helpNavs" @click="handleCheckHelpNav(item)">
                <n-tooltip placement="right" trigger="hover" :theme-overrides="tooltipThemeOverrides">
                    <template #trigger>
                        <n-icon size="22" :component="item.icon"></n-icon>
                    </template>
                    {{ item.tips }}
                </n-tooltip>
            </li>
        </ul>
    </div>
    <LayoutAbout ref="layoutAboutRef"></LayoutAbout>
    <LayoutHelp ref="layoutHelpRef"></LayoutHelp>
</template>
<style lang="less" scoped>
.layout-sider {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    background-color: #ededf5;
}

.layout-sider__item {
    list-style: none;
    padding: 0;
    margin: 0;

    &-nav {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 56px;
        cursor: pointer;
        color: #bbb0cf;
        transition: color 0.3s;

        &.active {
            color: #705697;

            &::after {
                position: absolute;
                content: "";
                width: 4px;
                background-color: #705697;
                height: 80%;
                left: 0;
            }
        }

        &:hover {
            color: #705697;
        }
    }
}
</style>
