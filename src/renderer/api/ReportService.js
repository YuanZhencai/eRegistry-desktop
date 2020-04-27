import axios from 'axios'

export function getProjectReport(projectId) {
  return axios({
    url: `api/projects/${projectId}/report`,
    method: 'get'
  })
}

export function saveProjectReport(projectId, data) {
  return axios({
    url: `api/projects/${projectId}/report`,
    method: 'put',
    data
  })
}

export function getMineReports() {
  return axios({
    url: `api/reports/mine`,
    method: 'get'
  })
}

export function getAllReports(req) {
  return axios({
    url: `api/reports`,
    method: 'get',
    params: req
  })
}

export function getReport(id) {
  return axios({
    url: `api/reports/${id}`,
    method: 'get'
  })
}

export function createReport(data) {
  return axios({
    url: `api/reports`,
    method: 'post',
    data
  })
}

export function updateReport(data) {
  return axios({
    url: `api/reports`,
    method: 'put',
    data
  })
}

export function deleteReport(id) {
  return axios({
    url: `api/reports/${id}`,
    method: 'delete'
  })
}

export function copyReport(report) {
  return axios({
    url: `api/reports/copy`,
    method: 'post',
    data: report
  })
}

export function shareReport(report) {
  return axios({
    url: `api/reports/share`,
    method: 'post',
    data: report
  })
}
