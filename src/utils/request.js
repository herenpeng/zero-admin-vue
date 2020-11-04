import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
  // withCredentials: true, // send constokies when cross-domain requests
  // headers: {
  //   'Access-Control-Allow-Origin': '*'
  // }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['accessToken'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.code !== 20000) {
      // 50000：系统错误
      if (res.code === 50000) {
        Message({
          message: res.message || '系统错误',
          type: 'error',
          duration: 2 * 1000
        })
      }
      // 30000：登录错误
      if (res.code === 30000) {
        Message({
          message: res.data.msg || '登录错误',
          type: 'error',
          duration: 2 * 1000
        })
      }
      if (res.code === 40003) {
        Message({
          message: res.message || '您的访问权限不足，无法访问该页面数据，或进行该操作',
          type: 'warning',
          duration: 1000
        })
        return res
        // router.push('/403')
      }
      // 40002：未登录或者访问凭证失效，需要重新登录
      if (res.code === 40002) {
        // to re-login
        MessageBox.confirm('您的账号已登出，可以取消以保留在该页面上，或者再次登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || '系统错误'))
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
