import request from '@/utils/request'

export function getMineProjects() {
  return request({
    url: `/api/projects/mine`,
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

export function assignMemberTask() {
  return request({
    url: `/api/member-tasks/assign`,
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
