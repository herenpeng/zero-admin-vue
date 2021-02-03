import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

export function fileUpload(path, file, data) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    if (typeof data === 'object') {
      for (const key in data) {
        formData.append(key, data[key])
      }
    }
    axios.defaults.headers.common['accessToken'] = getToken()
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    axios({
      url: process.env.VUE_APP_BASE_HTTP_API + path,
      method: 'post',
      data: formData
    }).then(response => {
      const res = response.data
      if (res.code === 20000) {
        resolve(res)
      } else {
        if (res.code === 40003) {
          Message({
            message: res.message || '您的访问权限不足，无法访问该页面数据，或进行该操作',
            type: 'warning',
            duration: 2 * 1000
          })
        } else {
          Message({
            message: res.message || '系统错误',
            type: 'error',
            duration: 2 * 1000
          })
        }
        return res
      }
    }).catch(err => {
      Message({
        message: '系统错误',
        type: 'error',
        duration: 2 * 1000
      })
      reject(err)
    })
  })
}
