import request from '@/utils/request'
import { fileUpload } from '@/utils/file-upload'

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function updateUserInfo(userInfo) {
  return request({
    url: '/user/info',
    method: 'put',
    data: userInfo
  })
}

export function getAvatar() {
  return request({
    url: '/user/info/avatar',
    method: 'get'
  })
}

export function uploadAvatar(file) {
  return fileUpload('/user/info/avatar', file)
}
