import request from '@/utils/request'

export function getResourcesPage(page, query) {
  query.size = page.size
  return request({
    url: '/resources/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function createResources(resources) {
  return request({
    url: '/resources',
    method: 'post',
    data: resources
  })
}

export function updateResources(resources) {
  return request({
    url: '/resources',
    method: 'put',
    data: resources
  })
}

export function deleteResources(id) {
  return request({
    url: '/resources/' + id,
    method: 'delete'
  })
}

export function deleteResourcesRole(resourcesId, roleId) {
  return request({
    url: '/resources/role/' + resourcesId,
    method: 'delete',
    params: { roleId }
  })
}

export function getResourcesNotRoleList(resourcesId) {
  return request({
    url: '/resources/role/' + resourcesId,
    method: 'get'
  })
}

export function addResourcesRole(resourcesId, roleId) {
  return request({
    url: '/resources/role/' + resourcesId,
    method: 'post',
    params: { roleId }
  })
}
