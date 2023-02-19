import { darkTheme } from 'naive-ui'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import type AbstractFileSystem from "@/utils/fs/core/AbstractFileSystem"

export const fileStore = reactive({
    fs: <AbstractFileSystem | null>null,
    setFileSystem(fs: AbstractFileSystem) {
        this.fs = fs
    }
})

export const themmStore = reactive({
    mode: <BuiltInGlobalTheme | null>null,
    config: {
        themeMode: 'light',
        layoutSiderWidth: '54px',
        editorAsideWidth: '280px',
    },
    changeMode(mode: 'light' | 'dark') {
        this.mode = mode === 'light' ? null : darkTheme
    }
})