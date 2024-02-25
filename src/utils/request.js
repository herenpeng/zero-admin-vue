import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import i18n from '../lang'

// 创建一个axios实例
const service = axios.create({
  // 请求基本路径
  baseURL: process.env.VUE_APP_BASE_HTTP_API,
  // 请求超时时间，5000毫秒
  timeout: 5000
  // withCredentials: true, // send constokies when cross-domain requests
  // headers: {
  //   'Access-Control-Allow-Origin': '*'
  // }
})

// HTTP请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 将token设置到请求头中
      config.headers['accessToken'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// HTTP响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000) {
      // 30000：登录错误
      if (res.code === 30000) {
        Message({
          message: res.message || i18n.t('request.loginError'),
          type: 'error',
          duration: 2 * 1000
        })
      }
      if (res.code === 40003) {
        Message({
          message: res.message || i18n.t('request.insufficientPermissions'),
          type: 'warning',
          duration: 2 * 1000
        })
        return null
      }
      // 40002：未登录或者访问凭证失效，需要重新登录
      if (res.code === 40002) {
        // to re-login
        MessageBox.confirm(i18n.t('request.loginAgainTip'), i18n.t('request.loginAgainTitle'), {
          confirmButtonText: i18n.t('request.loginAgain'),
          cancelButtonText: i18n.t('request.loginCancel'),
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
        return null
      }
      // 其他类型的异常信息在这里进行处理
      Message({
        message: res.message || i18n.t('request.systemError'),
        type: 'error',
        duration: 2 * 1000
      })
      // return Promise.reject(new Error(res.message || '系统错误'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
