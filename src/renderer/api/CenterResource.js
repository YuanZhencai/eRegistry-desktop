import request from '@/utils/request'

export function getProjectCenters(projectId) {
  return request({
    url: `/api/projects/${projectId}/centers`,
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

export function getCenter(id) {
  return request({
    url: `/api/centers/${id}`,
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

export function deleteCenter(id) {
  return request({
    url: `/api/centers/${id}`,
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

export function updateCenter() {
  return request({
    url: `/api/centers`,
    method: 'put',
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

export function createCenter() {
  return request({
    url: `/api/centers`,
    method: 'post',
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
