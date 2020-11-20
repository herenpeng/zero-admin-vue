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

export function updateUser(user) {
  return request({
    url: '/user',
    method: 'put',
    data: user
  })
}

export function deleteMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'delete'
  })
}

export function deleteUserRole(userId, roleId) {
  return request({
    url: '/user/role/' + userId,
    method: 'delete',
    params: { roleId }
  })
}

export function getUserNotRoleList(userId) {
  return request({
    url: '/user/role/' + userId,
    method: 'get'
  })
}

export function addUserRole(userId, roleId) {
  return request({
    url: '/user/role/' + userId,
    method: 'post',
    params: { roleId }
  })
}

export function getList() {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}
