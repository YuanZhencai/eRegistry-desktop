import request from '@/utils/request'

export function getDateChart(projectId, params) {
  return request({
    url: `/api/projects/${projectId}/chart/date`,
    method: 'get',
    params
  })
}

export function getPlanChart(projectId) {
  return request({
    url: `/api/projects/${projectId}/chart/plan`,
    method: 'get'
  })
}

export function getProjectStatistics(projectId) {
  return request({
    url: `/api/projects/${projectId}/statistics`,
    method: 'get'
  })
}
