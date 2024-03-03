import request from '@/utils/request'

export function getTableColumnPage(page, query) {
  query.size = page.size
  return request({
    url: '/table/column/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function getByTableInfoId(tableInfoId) {
  return request({
    url: '/table/column/table/info/' + tableInfoId,
    method: 'get'
  })
}

export function updateTableColumn(tableColumn) {
  return request({
    url: '/table/column',
    method: 'put',
    data: tableColumn
  })
}

export function synchronTableColumn(tableInfoId) {
  return request({
    url: '/table/column/synchron/' + tableInfoId,
    method: 'put'
  })
}
