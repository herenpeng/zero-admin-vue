import { updateUserConfigByKey } from '@/api/system/user-config'
import { getByKey } from '@/api/system/config'
import store from '@/store'

const config = require('@/config')

export function loadConfig() {
  getByKey(config.THEME_COLOR).then(res => {
    if (res.data) {
      setConfig('theme', res.data)
    }
  })
}

export function setConfig(key, value) {
  store.dispatch('settings/changeSetting', {
    key: key,
    value: value
  })
}

export function updateUserConfig(key, value) {
  updateUserConfigByKey(key, value).then(res => {
  })
}
