import request from '@/utils/request'

export function getTableInfoPage(page, query) {
  query.size = page.size
  return request({
    url: '/table/info/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function getById(id) {
  return request({
    url: '/table/info/' + id,
    method: 'get'
  })
}

export function getNotAddList(id, value) {
  return request({
    url: '/table/info/not/list',
    method: 'get'
  })
}

export function createTableInfo(tableInfo) {
  return request({
    url: '/table/info',
    method: 'post',
    data: tableInfo
  })
}

export function updateTableInfo(tableInfo) {
  return request({
    url: '/table/info',
    method: 'put',
    data: tableInfo
  })
}

export function deleteTableInfo(id) {
  return request({
    url: '/table/info/' + id,
    method: 'delete'
  })
}

export function codeGeneration(id) {
  return request({
    url: '/table/info/code/generation/' + id,
    method: 'post'
  })
}


export function getTableInfoRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/table/info/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverTableInfo(id) {
  return request({
    url: '/table/info/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteTableInfo(id) {
  return request({
    url: '/table/info/recover/' + id,
    method: 'delete'
  })
}

