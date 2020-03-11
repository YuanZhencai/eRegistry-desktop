import request from '@/utils/request'

export function getProjectReport(projectId) {
  return request({
    url: `/api/projects/${projectId}/report`,
    method: 'get'
  })
}

export function saveProjectReport(projectId, data) {
  return request({
    url: `/api/projects/${projectId}/report`,
    method: 'put',
    data
  })
}

export function getMineReports() {
  return request({
    url: `/api/reports/mine`,
    method: 'get'
  })
}

export function getReports(req) {
  return request({
    url: `/api/reports`,
    method: 'get',
    params: req
  })
}

export function getReport(id) {
  return request({
    url: `/api/reports/${id}`,
    method: 'get'
  })
}

export function saveReport(report) {
  return request({
    url: `/api/reports`,
    method: 'put',
    data: report
  })
}

export function deleteReport(id) {
  return request({
    url: `/api/reports/${id}`,
    method: 'delete'
  })
}

export function copyReport(report) {
  return request({
    url: `/api/reports/copy`,
    method: 'post',
    data: report
  })
}

export function shareReport(report) {
  return request({
    url: `/api/reports/share`,
    method: 'post',
    data: report
  })
}
