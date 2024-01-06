import { constantRoutes, errorRoutes } from '@/router'
import { getRoutes } from '@/api/data/menu'
import Layout from '@/layout'
import { Message } from 'element-ui'

export function generateMenu(menuList) {
  const routes = []
  menuList.forEach(item => {
    const menu = {}
    if (item.component) {
      // 判断 item.component 是否等于 'Layout',若是则直接替换成引入的 Layout 组件
      if (item.component === 'Layout') {
        menu.component = Layout
      } else {
        //  item.component 不等于 'Layout',则说明它是组件路径地址，因此直接替换成路由引入的方法
        menu.component = (resolve) => require([`@/views/${item.component}`], resolve)
      }
    }
    menu.path = item.path
    menu.name = item.name
    menu.meta = {}
    menu.meta.title = item.metaTitle
    menu.meta.icon = item.metaIcon
    menu.hidden = item.hidden
    // 若遍历的当前路由存在子路由，需要对子路由进行递归遍历
    if (item.children && item.children.length) {
      menu.children = generateMenu(item.children)
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
