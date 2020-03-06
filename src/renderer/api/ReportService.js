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

export function getReport(id) {
  return request({
    url: `/api/reports/${id}`,
    method: 'get'
  })
}

export function createReport(data) {
  return request({
    url: `/api/reports`,
    method: 'post',
    data
  })
}

export function updateReport(data) {
  return request({
    url: `/api/reports`,
    method: 'put',
    data
  })
}

export function deleteReport(id) {
  return request({
    url: `/api/reports/${id}`,
    method: 'delete'
  })
}

export function shareReport(data) {
  return request({
    url: `/api/reports/share`,
    method: 'post',
    data
  })
}

export function copyReport(data) {
  return request({
    url: `/api/reports/copy`,
    method: 'post',
    data
  })
}

export function getAllReports() {
  return request({
    url: `/api/reports`,
    method: 'get'
  })
}
