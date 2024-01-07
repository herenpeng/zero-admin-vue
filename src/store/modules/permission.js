import { constantRoutes, errorRoutes } from '@/router'
import { getRoutes } from '@/api/data/menu'
import Layout from '@/layout'
import { Message } from 'element-ui'

export function generateMenu(menuList, componentParent = '') {
  const routes = []
  menuList.forEach(item => {
    const menu = {}
    const component = componentParent + (item.path.startsWith('/') ? item.path : '/' + item.path)
    if (item.parentId === 0) {
      menu.component = Layout
    } else {
      menu.component = (resolve) => require([`@/views${component}`], resolve)
    }
    menu.path = item.path
    menu.name = item.name
    menu.meta = {
      title: item.metaTitle,
      icon: item.metaIcon
    }
    menu.hidden = item.hidden
    // 若遍历的当前路由存在子路由，需要对子路由进行递归遍历
    if (item.children && item.children.length) {
      menu.children = generateMenu(item.children, component)
    }
    routes.push(menu)
  })
  return routes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes).concat(errorRoutes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
      getRoutes().then(res => {
        if (res.code !== 20000) {
          Message({
            message: '菜单数据加载异常',
            type: 0,
            duration: 2 * 1000
          })
        } else {
          const routes = generateMenu(res.data)
          commit('SET_ROUTES', routes)
          resolve(routes)
        }
      }).catch(error => {
        console.log(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
