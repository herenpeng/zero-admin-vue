import request from '@/utils/request'

export function getServerPieChartInfo() {
  return request({
    url: '/server/piechart',
    method: 'get'
  })
}

export function getServerInfo() {
  return request({
    url: '/server/info',
    method: 'get'
  })
}
