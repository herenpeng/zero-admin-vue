import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

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
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/error/403'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/index/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/data',
    component: Layout,
    redirect: '/data/user',
    name: 'Data',
    meta: { title: '数据管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/data/user/index'),
        meta: { title: '用户管理', icon: 'el-icon-user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/data/role/index'),
        meta: { title: '角色管理', icon: 'el-icon-discount' }
      },
      {
        path: 'resources',
        name: 'Resources',
        component: () => import('@/views/data/resources/index'),
        meta: { title: '资源管理', icon: 'el-icon-star-on' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/server',
    name: 'System',
    meta: { title: '系统监控', icon: 'el-icon-view' },
    children: [
      {
        path: 'server',
        name: 'Server',
        component: () => import('@/views/system/server/index'),
        meta: { title: '服务器监控', icon: 'el-icon-monitor' }
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/system/log/index'),
        meta: { title: '日志管理', icon: 'el-icon-tickets' }
      }
    ]
  },

  {
    path: '/development',
    component: Layout,
    redirect: '/development/code-generation',
    name: 'CodeGeneration',
    meta: { title: '系统开发', icon: 'el-icon-monitor' },
    children: [
      {
        path: 'code-generation',
        name: 'CodeGeneration',
        component: () => import('@/views/development/code-generation/index'),
        meta: { title: '代码生成', icon: 'el-icon-refresh-right' }
      },
      {
        path: process.env.VUE_APP_BASE_API + '/swagger-ui.html',
        name: 'Swagger2',
        meta: { title: '项目文档', icon: 'el-icon-notebook-2' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
