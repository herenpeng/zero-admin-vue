import request from '@/utils/request'

export function getUserPage(page, query) {
  return request({
    url: '/user/page/' + page.currentPage,
    method: 'get',
    params: { size: page.size }
  })
}

export function enabled(id, value) {
  return request({
    url: '/user/enabled/' + id,
    method: 'put',
    params: { enabled: value }
  })
}

export function createUser(user) {
  return request({
    url: '/user',
    method: 'post',
    data: user
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
