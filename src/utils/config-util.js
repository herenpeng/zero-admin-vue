import { updateUserConfigByKey } from '@/api/system/user-config'
import { getByKey } from '@/api/system/config'
import store from '@/store'

const config = require('@/config')

export function loadConfig() {
  getByKey(config.RECORD_NUMBER).then(res => {
    if (res.data) {
      setConfig('recordNumber', res.data)
    }
  })
  getByKey(config.THEME_COLOR).then(res => {
    if (res.data) {
      setConfig('theme', res.data)
    }
  })
  getByKey(config.TAGS_VIEW).then(res => {
    if (res.data === 'true') {
      setConfig('tagsView', true)
    } else {
      setConfig('tagsView', false)
    }
  })
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
