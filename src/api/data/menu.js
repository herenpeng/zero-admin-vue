import request from '@/utils/request'

export function getMenuPage(page, query) {
  query.size = page.size
  return request({
    url: '/menu/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function enabled(id, value) {
  return request({
    url: '/menu/enabled/' + id,
    method: 'put',
    params: { enabled: value }
  })
}

export function createMenu(menu) {
  return request({
    url: '/menu',
    method: 'post',
    data: menu
  })
}

export function updateMenu(menu) {
  return request({
    url: '/menu',
    method: 'put',
    data: menu
  })
}

export function deleteMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'delete'
  })
}

export function deleteMenuRole(menuId, roleId) {
  return request({
    url: '/menu/role/' + menuId,
    method: 'delete',
    params: { roleId }
  })
}

export function getMenuNotRoleList(menuId) {
  return request({
    url: '/menu/role/' + menuId,
    method: 'get'
  })
}

export function addMenuRole(menuId, roleId) {
  return request({
    url: '/menu/role/' + menuId,
    method: 'post',
    params: { roleId }
  })
}

export function getRoutes() {
  return request({
    url: '/menu/routes',
    method: 'get'
  })
}
