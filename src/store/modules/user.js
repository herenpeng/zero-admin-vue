import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 用户登录
  login({ commit }, loginForm) {
    return new Promise((resolve, reject) => {
      const { username, password } = loginForm
      login(username.trim(), password).then(res => {
        const accessToken = res.data
        // 将登陆之后返回的token信息设置到cookie中
        setToken(accessToken)
        // 将登陆之后返回的token信息存储到store中
        commit('SET_TOKEN', accessToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户的详细信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          return reject('验证失败，请重新登录。')
        }
        const { username, userInfo } = data
        commit('SET_USERNAME', username)
        commit('SET_AVATAR', userInfo.avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户退出系统
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 通过OAuth授权登录
  loginByOauth({ commit }, accessToken) {
    return new Promise((resolve, reject) => {
      // 将第三方授权之后返回的token信息设置到cookie中
      console.log('accessToken:' + accessToken)
      setToken(accessToken)
      // 将登陆之后返回的token信息存储到store中
      commit('SET_TOKEN', accessToken)
      resolve()
    })
  },

  // 移除cookie和vuex中的Token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 刷新头像路径
  resetAvatar({ commit }, avatar) {
    return new Promise(resolve => {
      commit('SET_AVATAR', avatar)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

