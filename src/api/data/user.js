import request from '@/utils/request'

export function getUserPage(page, query) {
  return request({
    url: '/user/page/' + page.currentPage,
    method: 'get',
    params: { size: page.size }
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

export function getRoleList(userId) {
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
