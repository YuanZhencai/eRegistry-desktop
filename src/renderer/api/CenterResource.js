import request from '@/utils/request'

export function getProjectCenters(projectId, params) {
  return request({
    url: `/api/projects/${projectId}/centers`,
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

export function updateCenter(center) {
  return request({
    url: `/api/centers`,
    method: 'put',
    data: center,
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

export function createCenter(center) {
  return request({
    url: `/api/centers`,
    method: 'post',
    data: center,
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

export function getAllCenters(params) {
  return request({
    url: `/api/centers`,
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
