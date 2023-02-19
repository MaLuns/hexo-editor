<script lang="ts" setup>
import type { TooltipProps } from "naive-ui";
import { siderPage } from "@/router";

const router = useRouter()
const data = reactive({
    active: 0,
    navs: siderPage.map(item => {
        return {
            name: <string>item.name,
            icon: <Component>item?.meta?.icon,
            tips: <string>item?.meta?.tips
        }
    })
})

const checkNav = (index: number) => {
    data.active = index
    let nav = data.navs[index]
    if (nav.name) {
        router.push({
            name: nav.name
        })
    }
}

type TooltipThemeOverrides = NonNullable<TooltipProps['themeOverrides']>
const tooltipThemeOverrides: TooltipThemeOverrides = {
    color: '#fff',
    textColor: '#000',
    peers: {
        Popover: {
            spaceArrow: '20px'
        }
    }
}
</script>
<template>
    <ul class="layout-sider">
        <li v-for="(item, index) in data.navs" class="layout-sider-item" :class="{ active: data.active === index }"
            @click="checkNav(index)">
            <n-tooltip placement="right" trigger="hover" :theme-overrides="tooltipThemeOverrides">
                <template #trigger>
                    <n-icon size="24" :component="item.icon"> </n-icon>
                </template>
                {{ item.tips }}
            </n-tooltip>
        </li>
    </ul>
</template>
<style lang="less" scoped>
.layout-sider {
    list-style: none;
    padding: 0;
    margin: 0;
    background-color: #EDEDF5;
    height: 100%;

    &-item {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 64px;
        cursor: pointer;
        color: #BBB0CF;
        transition: color .3s;

        &.active {
            color: #705697;

            &::after {
                position: absolute;
                content: '';
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