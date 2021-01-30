import defaultSettings from '@/settings'

const title = defaultSettings.title || 'zero-admin-vue'

export default function getPageTitle(pageTitle) {
  if (title && pageTitle) {
    return title + '-' + pageTitle
  } else {
    return pageTitle || title
  }
}
