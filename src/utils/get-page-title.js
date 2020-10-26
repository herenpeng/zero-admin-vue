import defaultSettings from '@/settings'

const title = defaultSettings.title || 'zero-admin-vue'

export default function getPageTitle(key) {
  return title || key
}
