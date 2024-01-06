import request from '@/utils/request'
import { exportExcel } from '@/utils/export-file'

export function getLoginLogPage(page, query) {
  query.size = page.size
  return request({
    url: '/login/log/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function deleteLoginLog(id) {
  return request({
    url: '/login/log/' + id,
    method: 'delete'
  })
}

export function getLoginLogRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/login/log/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverLoginLog(id) {
  return request({
    url: '/login/log/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteLoginLog(id) {
  return request({
    url: '/login/log/recover/' + id,
    method: 'delete'
  })
}

export function exportLoginLogExcel(query, fileName) {
  exportExcel('/login/log/export/excel', query, fileName)
}

export function online(userId) {
  return request({
    url: '/login/log/online/' + userId,
    method: 'get'
  })
}

export function offline(userId, tokenId) {
  return request({
    url: '/login/log/offline/' + userId,
    method: 'put',
    params: { tokenId }
  })
}
