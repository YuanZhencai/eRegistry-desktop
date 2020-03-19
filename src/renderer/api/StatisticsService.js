import axios from 'axios'

export function getDateChart(projectId, params) {
  return axios({
    url: `/api/projects/${projectId}/chart/date`,
    method: 'get',
    params
  })
}

export function getPlanChart(projectId) {
  return axios({
    url: `/api/projects/${projectId}/chart/plan`,
    method: 'get'
  })
}

export function getProjectStatistics(projectId) {
  return axios({
    url: `/api/projects/${projectId}/statistics`,
    method: 'get'
  })
}
