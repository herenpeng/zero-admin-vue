import request from '@/utils/request'

export function getCpuInfo() {
  return request({
    url: '/server/cpu',
    method: 'get'
  })
}

export function getJvmInfo() {
  return request({
    url: '/server/jvm',
    method: 'get'
  })
}

export function getCMemInfo() {
  return request({
    url: '/server/mem',
    method: 'get'
  })
}

export function getServerInfo() {
  return request({
    url: '/server/info',
    method: 'get'
  })
}
