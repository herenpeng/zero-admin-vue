import request from '@/utils/request'
import { exportExcel } from '@/utils/export-file'

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

export function getRoleRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/role/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverRole(id) {
  return request({
    url: '/role/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteRole(id) {
  return request({
    url: '/role/recover/' + id,
    method: 'delete'
  })
}

export function exportRoleExcel(query, fileName) {
  exportExcel('/role/export/excel', query, fileName)
}
