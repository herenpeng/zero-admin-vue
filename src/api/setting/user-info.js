import { fileUpload } from '@/utils/file-upload'

export function uploadAvatar(file) {
  return fileUpload('/user/info/avatar', file)
}
