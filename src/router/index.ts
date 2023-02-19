import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { DocumentsOutline, BookmarksOutline, OptionsOutline } from "@vicons/ionicons5";
import HomeView from '../views/home/index.vue'
import { fileStore } from "@/store";

export const siderPage: RouteRecordRaw[] = [
  {
    path: '',
    name: 'editer',
    meta: {
      icon: markRaw(DocumentsOutline),
      tips: '文章管理'
    },
    component: () => import('../views/editor/index.vue')
  },
  {
    path: 'assets',
    name: 'assets',
    meta: {
      icon: markRaw(BookmarksOutline),
      tips: '资源文件管理'
    },
    component: () => import('../views/assets/index.vue')
  },
  {
    path: 'config',
    name: 'config',
    meta: {
      icon: markRaw(OptionsOutline),
      tips: '配置修改'
    },
    component: () => import('../views/config/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/editer',
      component: () => import('../components/layout/index.vue'),
      children: siderPage
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'home' && !fileStore.fs) next({ name: 'home' })
  else next()
})

export default router
