import request from '@/utils/request'
import { exportExcel } from '@/utils/export-file'

export function getLogPage(page, query) {
  query.size = page.size
  return request({
    url: '/log/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function deleteLog(id) {
  return request({
    url: '/log/' + id,
    method: 'delete'
  })
}

export function getLogRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/log/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverLog(id) {
  return request({
    url: '/log/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteLog(id) {
  return request({
    url: '/log/recover/' + id,
    method: 'delete'
  })
}

export function exportLogExcel(query, fileName) {
  exportExcel('/log/export/excel', query, fileName)
}
