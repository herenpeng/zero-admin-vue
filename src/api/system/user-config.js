import request from '@/utils/request'
import { exportExcel } from '@/utils/export-file'

export function getUserConfigPage(page, query) {
  query.size = page.size
  return request({
    url: '/user/config/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function createUserConfig(userConfig) {
  return request({
    url: '/user/config',
    method: 'post',
    data: userConfig
  })
}

export function updateUserConfig(userConfig) {
  return request({
    url: '/user/config',
    method: 'put',
    data: userConfig
  })
}

export function deleteUserConfig(id) {
  return request({
    url: '/user/config/' + id,
    method: 'delete'
  })
}

export function getUserConfigRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/user/config/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverUserConfig(id) {
  return request({
    url: '/user/config/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteUserConfig(id) {
  return request({
    url: '/user/config/recover/' + id,
    method: 'delete'
  })
}

export function exportUserConfigExcel(query, fileName) {
  exportExcel('/user/config/export/excel', query, fileName)
}
