import request from '@/utils/request'

export function getWeather() {
  return request({
    url: '/index/weather',
    method: 'get'
  })
}

export function indexChart() {
  return request({
    url: '/index/chart',
    method: 'get'
  })
}

export function getLoginMap() {
  return request({
    url: '/index/login/map',
    method: 'get'
  })
}
