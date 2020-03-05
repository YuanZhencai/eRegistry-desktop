import request from '@/utils/request'

export function getCenterMember(id) {
  return request({
    url: `/api/center-members/${id}`,
    method: 'get'
  })
}

export function getCenterMemberByMemberId(memberId) {
  return request({
    url: `/api/members/${memberId}/center`,
    method: 'get'
  })
}

export function createCenterMember(centerMember) {
  return request({
    url: `/api/center-members`,
    method: 'post',
    data: centerMember
  })
}

export function updateCenterMember(centerMember) {
  return request({
    url: `/api/center-members`,
    method: 'put',
    data: centerMember
  })
}
