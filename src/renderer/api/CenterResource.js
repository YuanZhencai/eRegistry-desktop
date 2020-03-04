import request from '@/utils/request'

export function getProjectCenters(projectId, params) {
  return request({
    url: `/api/projects/${projectId}/centers`,
    method: 'get',
    params: params
  })
}

export function getCenter(id) {
  return request({
    url: `/api/centers/${id}`,
    method: 'get'
  })
}

export function deleteCenter(id) {
  return request({
    url: `/api/centers/${id}`,
    method: 'delete'
  })
}

export function updateCenter(center) {
  return request({
    url: `/api/centers`,
    method: 'put',
    data: center
  })
}

export function createCenter(center) {
  return request({
    url: `/api/centers`,
    method: 'post',
    data: center
  })
}

export function getAllCenters(params) {
  return request({
    url: `/api/centers`,
    method: 'get',
    params: params
  })
}
