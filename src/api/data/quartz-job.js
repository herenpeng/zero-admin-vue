import request from '@/utils/request'
import { exportExcel } from '@/utils/export-file'

export function getQuartzJobPage(page, query) {
  query.size = page.size
  return request({
    url: '/quartz/job/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function getQuartzJobList(query) {
  return request({
    url: '/quartz/job/list',
    method: 'get',
    params: query
  })
}


export function createQuartzJob(quartzJob) {
  return request({
    url: '/quartz/job',
    method: 'post',
    data: quartzJob
  })
}

export function updateQuartzJob(quartzJob) {
  return request({
    url: '/quartz/job',
    method: 'put',
    data: quartzJob
  })
}

export function deleteQuartzJob(id) {
  return request({
    url: '/quartz/job/' + id,
    method: 'delete'
  })
}

export function getQuartzJobRecoverPage(page, query) {
  query.size = page.size
  return request({
    url: '/quartz/job/recover/page/' + page.currentPage,
    method: 'get',
    params: query
  })
}

export function recoverQuartzJob(id) {
  return request({
    url: '/quartz/job/recover/' + id,
    method: 'put'
  })
}

export function recoverDeleteQuartzJob(id) {
  return request({
    url: '/quartz/job/recover/' + id,
    method: 'delete'
  })
}

export function exportQuartzJobExcel(query, fileName) {
  exportExcel('/quartz/job/export/excel', query, fileName)
}
