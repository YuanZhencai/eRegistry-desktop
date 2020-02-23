import request from '@/utils/request'

export function createCenterMember() {
  return request({
    url: `/api/center-members`,
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

export function updateCenterMember() {
  return request({
    url: `/api/center-members`,
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
