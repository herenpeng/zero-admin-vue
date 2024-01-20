import request from '@/utils/request'
import { exportExcel } from '@/utils/export-file'

export function getOrganPage(page, query) {
  query.size = page.size
  return request({
    url: '/organ/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function getOrganList(query) {
  return request({
    url: '/organ/list',
    method: 'get',
    params: query
  })
}

export function getOrganTree() {
  return request({
    url: '/organ/tree',
    method: 'get'
  })
}

export function moveOrgan(organ) {
  return request({
    url: '/organ/move',
    method: 'put',
    data: organ
  })
}

export function createOrgan(organ) {
  return request({
    url: '/organ',
    method: 'post',
    data: organ
  })
}

export function updateOrgan(organ) {
  return request({
    url: '/organ',
    method: 'put',
    data: organ
  })
}

export function deleteOrgan(id) {
  return request({
    url: '/organ/' + id,
    method: 'delete'
  })
}

export function getOrganRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/organ/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverOrgan(id) {
  return request({
    url: '/organ/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteOrgan(id) {
  return request({
    url: '/organ/recover/' + id,
    method: 'delete'
  })
}

export function exportOrganExcel(query, fileName) {
  exportExcel('/organ/export/excel', query, fileName)
}
