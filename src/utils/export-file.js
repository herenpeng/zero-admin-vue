export function exportExcel(path, params) {
  if ('download' in document.createElement('a')) {
    // 支持a标签download的浏览器
    const link = document.createElement('a')
    // 创建a标签link.download 并设置a标签添加属性
    link.style.display = 'none'
    let url = process.env.VUE_APP_BASE_API + path + '?'
    // 如果参数是一个对象
    if (Object.prototype.toString.call(params) === '[object Object]') {
      for (const key in params) {
        const value = params[key]
        if (value !== null) {
          if (url.endsWith('?')) {
            url += key + '=' + value
          } else {
            url += '&' + key + '=' + value
          }
        }
      }
    }
    link.href = url
    document.body.appendChild(link)
    // 执行下载
    link.click()
    // 释放url
    URL.revokeObjectURL(link.href)
    // 释放标签
    document.body.removeChild(link)
  }
}
