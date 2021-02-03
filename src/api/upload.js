import { fileUpload } from '@/utils/file-upload'

export function uploadImage(file) {
  return fileUpload('/upload/image', file)
}
