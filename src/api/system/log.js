import request from '@/utils/request'

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
