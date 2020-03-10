import request from '@/utils/request'

export function getProject(id) {
  return request({
    url: `/api/projects/${id}`,
    method: 'get'
  })
}

export function getMineProjects(params) {
  return request({
    url: `/api/projects/mine`,
    method: 'get',
    params: params
  })
}

export function getProjectUsers(id) {
  return request({
    url: `/api/projects/${id}/users`,
    method: 'get'
  })
}

export function deleteProject(id) {
  return request({
    url: `/api/projects/${id}`,
    method: 'delete'
  })
}

export function createProject(project) {
  return request({
    url: `/api/projects`,
    method: 'post',
    data: project
  })
}

export function updateProject(project) {
  return request({
    url: `/api/projects`,
    method: 'put',
    data: project
  })
}

export function getChanges(id, params) {
  return request({
    url: `/api/projects/${id}/changes`,
    method: 'get',
    params
  })
}

export function exportChangesData(id, params) {
  return request({
    url: `/api/projects/${id}/changes/data`,
    method: 'get',
    params
  })
}
