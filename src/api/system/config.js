import request from '@/utils/request'
import { exportExcel } from '@/utils/export-file'

export function getConfigConstPage(page, query) {
  query.size = page.size
  return request({
    url: '/config/const/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function createConfigConst(configConst) {
  return request({
    url: '/config/const',
    method: 'post',
    data: configConst
  })
}

export function updateConfigConst(configConst) {
  return request({
    url: '/config/const',
    method: 'put',
    data: configConst
  })
}

export function deleteConfigConst(id) {
  return request({
    url: '/config/const/' + id,
    method: 'delete'
  })
}

export function getKeyList(key, userable) {
  return request({
    url: '/config/const/list/key',
    method: 'get',
    params: { key, userable }
  })
}

export function getByKey(key) {
  return request({
    url: '/config/const/key',
    method: 'get',
    params: { key }
  })
}

export function getConfigConstRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/config/const/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverConfigConst(id) {
  return request({
    url: '/config/const/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteConfigConst(id) {
  return request({
    url: '/config/const/recover/' + id,
    method: 'delete'
  })
}

export function exportConfigConstExcel(query, fileName) {
  exportExcel('/config/const/export/excel', query, fileName)
}
