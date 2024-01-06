import request from '@/utils/request'
import { exportExcel } from '@/utils/export-file'

export function getOperationLogPage(page, query) {
  query.size = page.size
  return request({
    url: '/operation/log/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function deleteOperationLog(id) {
  return request({
    url: '/operation/log/' + id,
    method: 'delete'
  })
}

export function getOperationLogRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/operation/log/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverOperationLog(id) {
  return request({
    url: '/operation/log/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteLog(id) {
  return request({
    url: '/operation/log/recover/' + id,
    method: 'delete'
  })
}

export function exportLogExcel(query, fileName) {
  exportExcel('/operation/log/export/excel', query, fileName)
}
