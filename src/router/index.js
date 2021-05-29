import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const errorRoutes = [
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/error/403'),
    hidden: true
  },
  // 404页面一定要放在最后
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 系统路由
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Index',
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/index/index'),
      // affix 是 tagsView 标签中是否有关闭按钮，true值没有关闭按钮，常驻 tagsView 标签上
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes.concat(errorRoutes)
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
