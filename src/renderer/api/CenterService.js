import axios from 'axios'

export function getProjectCenters(projectId, params) {
  return axios({
    url: `api/projects/${projectId}/centers`,
    method: 'get',
    params: params
  })
}

export function getProjectCurrentCenter(projectId) {
  return axios({
    url: `api/projects/${projectId}/current-center`,
    method: 'get'
  })
}

export function getCenter(id) {
  return axios({
    url: `api/centers/${id}`,
    method: 'get'
  })
}

export function deleteCenter(id) {
  return axios({
    url: `api/centers/${id}`,
    method: 'delete'
  })
}

export function updateCenter(center) {
  return axios({
    url: `api/centers`,
    method: 'put',
    data: center
  })
}

export function createCenter(center) {
  return axios({
    url: `api/centers`,
    method: 'post',
    data: center
  })
}

export function getAllCenters(params) {
  return axios({
    url: `api/centers`,
    method: 'get',
    params: params
  })
}
