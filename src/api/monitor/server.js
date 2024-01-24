import request from '@/utils/request'

export function getServerChartInfo() {
  return request({
    url: '/server/chart',
    method: 'get'
  })
}

export function getServerInfo() {
  return request({
    url: '/server/info',
    method: 'get'
  })
}
