import axios from 'axios'

export function getProject(id) {
  return axios({
    url: `/api/projects/${id}`,
    method: 'get'
  })
}

export function getMineProjects(params) {
  return axios({
    url: `/api/projects/mine`,
    method: 'get',
    params: params
  })
}

export function getProjectUsers(id) {
  return axios({
    url: `/api/projects/${id}/users`,
    method: 'get'
  })
}

export function deleteProject(id) {
  return axios({
    url: `/api/projects/${id}`,
    method: 'delete'
  })
}

export function createProject(project) {
  return axios({
    url: `/api/projects`,
    method: 'post',
    data: project
  })
}

export function updateProject(project) {
  return axios({
    url: `/api/projects`,
    method: 'put',
    data: project
  })
}

export function findReport(id) {
  return axios({
    url: `/api/projects/${id}/report`,
    method: 'get'
  })
}
export function saveReport(id, report) {
  return axios({
    url: `/api/projects/${id}/report`,
    method: 'put',
    data: report
  })
}

export function getChanges(id, params) {
  return axios({
    url: `/api/projects/${id}/changes`,
    method: 'get',
    params
  })
}

export function exportChangesData(id, params) {
  return axios({
    url: `/api/projects/${id}/changes/data`,
    method: 'get',
    params
  })
}
