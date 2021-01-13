import request from '@/utils/request'
import { fileUpload } from '@/utils/file-upload'

export function getAvatar() {
  return request({
    url: '/user/info/avatar',
    method: 'get'
  })
}

export function uploadAvatar(file) {
  return fileUpload('/user/info/avatar', file)
}
