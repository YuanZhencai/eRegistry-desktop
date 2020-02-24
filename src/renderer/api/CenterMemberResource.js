import request from '@/utils/request'

export function getCenterMember(id) {
  return request({
    url: `/api/center-members/${id}`,
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

export function getCenterMemberByMemberId(memberId) {
  return request({
    url: `/api/members/${memberId}/center`,
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
