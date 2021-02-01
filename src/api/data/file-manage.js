import request from '@/utils/request'
import { exportExcel } from '@/utils/export-file'

export function getFileManagePage(page, query) {
  query.size = page.size
  return request({
    url: '/file/manage/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function createFileManage(fileManage) {
  return request({
    url: '/file/manage',
    method: 'post',
    data: fileManage
  })
}

export function updateFileManage(fileManage) {
  return request({
    url: '/file/manage',
    method: 'put',
    data: fileManage
  })
}

export function bakFileManage(id) {
  return request({
    url: '/file/manage/bak/' + id,
    method: 'post'
  })
}

export function deleteFileManage(id) {
  return request({
    url: '/file/manage/' + id,
    method: 'delete'
  })
}


export function getFileManageRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/file/manage/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverFileManage(id) {
  return request({
    url: '/file/manage/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteFileManage(id) {
  return request({
    url: '/file/manage/recover/' + id,
    method: 'delete'
  })
}

export function exportFileManageExcel(query, fileName) {
  exportExcel('/file/manage/export/excel', query, fileName)
}
