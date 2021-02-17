import request from '@/utils/request'

export function getLoginLogPage(page, query) {
  query.size = page.size
  return request({
    url: '/login/log/page/' + page.currentPage,
    method: 'get',
    params: query
  })
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
