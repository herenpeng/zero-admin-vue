import { getToken } from '@/utils/auth'

export function exportExcel(path, fileName, params) {
  if ('download' in document.createElement('a')) {
    // 支持a标签download的浏览器
    const link = document.createElement('a')
    // 创建a标签link.download 并设置a标签添加属性
    link.style.display = 'none'
    link.setAttribute('download', fileName + '.xlsx')
    const baseURL = process.env.VUE_APP_BASE_API
    const url = baseURL + path
    link.href = url + '?accessToken=' + getToken()
    document.body.appendChild(link)
    // 执行下载
    link.click()
    // 释放url
    URL.revokeObjectURL(link.href)
    // 释放标签
    document.body.removeChild(link)
  }
}
