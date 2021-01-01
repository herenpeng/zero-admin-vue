import request from '@/utils/request'

export function checkPassword(password) {
  return request({
    url: '/user/check/password',
    method: 'get',
    params: { password }
  })
}

export function resetPassword(oldPassword, newPassword) {
  return request({
    url: '/user/reset/password',
    method: 'put',
    params: { oldPassword, newPassword }
  })
}
