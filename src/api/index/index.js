import request from '@/utils/request'

export function getWeather() {
  return request({
    url: '/index/weather',
    method: 'get'
  })
}
