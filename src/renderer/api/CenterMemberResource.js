import request from '@/utils/request'

export function createCenterMember(centerMember) {
  return request({
    url: `/api/center-members`,
    method: 'post',
    data: centerMember,
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

export function updateCenterMember(centerMember) {
  return request({
    url: `/api/center-members`,
    method: 'put',
    data: centerMember,
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
