import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

export function exportExcel(path, params, fileName) {
  return new Promise((resolve, reject) => {
    axios.defaults.headers.common['accessToken'] = getToken()
    axios({
      url: process.env.VUE_APP_BASE_API + path,
      method: 'get',
      data: params,
      responseType: 'blob'
    }).then(response => {
      if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8') {
        const blob = new Blob([response.data])
        const downloadName = fileName + '.xlsx'
        // 非IE下载
        if ('download' in document.createElement('a')) {
          const link = document.createElement('a')
          link.download = downloadName
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click()
          // 释放URL 对象
          URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, downloadName)
        }
      } else {
        Message({
          message: '您的访问权限不足，无法进行导出操作，或系统发生错误',
          type: 'warning',
          duration: 2 * 1000
        })
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
