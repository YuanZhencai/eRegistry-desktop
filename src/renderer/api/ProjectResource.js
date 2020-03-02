import request from '@/utils/request'

export function getProject(id) {
  return request({
    url: `/api/projects/${id}`,
    method: 'get',
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}

export function getMineProjects(params) {
  return request({
    url: `/api/projects/mine`,
    method: 'get',
    params: params,
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}

export function getProjectUsers(id) {
  return request({
    url: `/api/projects/${id}/users`,
    method: 'get',
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}

export function deleteProject(id) {
  return request({
    url: `/api/projects/${id}`,
    method: 'delete',
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}
