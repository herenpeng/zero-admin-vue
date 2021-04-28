import request from '@/utils/request'

export function getWeather() {
  return request({
    url: '/index/weather',
    method: 'get'
  })
}

export function getPanelGroup() {
  return request({
    url: '/index/panel/group',
    method: 'get'
  })
}

export function getLoginMap() {
  return request({
    url: '/index/login/map',
    method: 'get'
  })
}
