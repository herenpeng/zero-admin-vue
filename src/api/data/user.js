import request from '@/utils/request'

export function getUserPage(page, query) {
  query.size = page.size
  return request({
    url: '/user/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function getUserDeletePage(page, query) {
  query.size = page.size
  return request({
    url: '/user/delete/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function enabled(id, value) {
  return request({
    url: '/user/enabled/' + id,
    method: 'put',
    params: { enabled: value }
  })
}

export function createUser(user) {
  return request({
    url: '/user',
    method: 'post',
    data: user
  })
}

export function updateUser(user) {
  return request({
    url: '/user',
    method: 'put',
    data: user
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/' + id,
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

export function recoverUser(id) {
  return request({
    url: '/user/recover/' + id,
    method: 'put'
  })
}
