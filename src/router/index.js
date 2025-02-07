import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
import NProgress from 'nprogress'
import getPageTitle from '@/utils/get-page-title'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { Message } from 'element-ui'

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

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // 获取token
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经有token，说明已经登录，直接跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.username
      if (hasGetUserInfo) {
        // 当正常跳转的路由路径存入sessionStorage中
        let query
        if (to.query) {
          query = '?' + Object.keys(to.query).map(key => key + '=' + to.query[key]).join('&')
        }
        sessionStorage.setItem('previousRoute', to.path + query)
        next()
      } else {
        try {
          // 如果没有获取到用户信息，可能是用户刚刚登录或者刷新了页面，重新从后台获取动态路由
          const accessRoutes = await store.dispatch('permission/generateRoutes')
          resetRouter()
          router.addRoutes(accessRoutes)
          const previousRoute = sessionStorage.getItem('previousRoute')
          // 如果sessionStorage中有上一个路由信息，说明是刷新页面，不是刚刚登录
          if (previousRoute !== null) {
            sessionStorage.removeItem('previousRoute')
            next(previousRoute)
          } else {
            // 刚刚登录，或者刷新后进入页面也将路由路径存放入sessionStorage中
            sessionStorage.setItem('previousRoute', to.path)
            // 从后台获取用户信息，并存入Vuex中
            await store.dispatch('user/getInfo')
            next()
          }
        } catch (error) {
          // 删除store和cookie中的accessToken信息
          await store.dispatch('user/resetToken')
          Message.error(error || '系统错误')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 未获取token，代表用户未登录，跳转登录页面
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果跳转的页面为/login，直接跳转页面
      next()
    } else {
      // 如果不是/login页面，重定向到/login页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 路由跳转之后要做的事情
  NProgress.done()
})

export default router
