import request from '@/utils/request'

export function getRolePage(page, query) {
  query.size = page.size
  return request({
    url: '/role/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function getRoleList(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function createRole(role) {
  return request({
    url: '/role',
    method: 'post',
    data: role
  })
}

export function updateRole(role) {
  return request({
    url: '/role',
    method: 'put',
    data: role
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/' + id,
    method: 'delete'
  })
}
