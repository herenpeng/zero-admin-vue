import { updateUserConfigByKey } from '@/api/setting/user-config'
import { getByKeys } from '@/api/setting/config'
import store from '@/store'

const config = require('@/config')

export function loadConfig() {
  const keys = []
  for (const configKey in config) {
    keys.push(config[configKey])
  }
  getByKeys(keys).then(res => {
    if (res.data) {
      for (const key in res.data) {
        setConfig(key, res.data[key])
      }
    }
  })
  // 备案号
  // getByKey(config.RECORD_NUMBER).then(res => {
  //   if (res.data) {
  //     setConfig('recordNumber', res.data)
  //   }
  // })
  // // 是否显示设置栏
  // getByKey(config.SHOW_SETTINGS).then(res => {
  //   if (res.data) {
  //     setConfig('showSettings', strToBool(res.data))
  //   }
  // })
  // // 主题颜色
  // getByKey(config.THEME_COLOR).then(res => {
  //   if (res.data) {
  //     setConfig('theme', res.data)
  //   }
  // })
  // // 开启页面顶部标签
  // getByKey(config.TAGS_VIEW).then(res => {
  //   if (res.data) {
  //     setConfig('tagsView', strToBool(res.data))
  //   }
  // })
  // // 固定顶部显示栏
  // getByKey(config.FIXED_HEADER).then(res => {
  //   if (res.data) {
  //     setConfig('fixedHeader', strToBool(res.data))
  //   }
  // })
  // // 显示侧边栏LOGO
  // getByKey(config.SIDEBAR_LOGO).then(res => {
  //   if (res.data) {
  //     setConfig('sidebarLogo', strToBool(res.data))
  //   }
  // })
}

export function updateUserConfig(key, value) {
  updateUserConfigByKey(key, value).then(res => {
  })
}

export function setConfig(key, value) {
  store.dispatch('settings/changeSetting', {
    key: key,
    value: value
  })
}

function strToBool(str) {
  return str === 'true'
}
