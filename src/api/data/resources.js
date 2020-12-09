import request from '@/utils/request'
import { exportExcel } from '@/utils/export-file'

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

export function getResourcesRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/resources/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverResources(id) {
  return request({
    url: '/resources/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteResources(id) {
  return request({
    url: '/resources/recover/' + id,
    method: 'delete'
  })
}

export function exportResourcesExcel(query, fileName) {
  exportExcel('/resources/export/excel', query, fileName)
}
