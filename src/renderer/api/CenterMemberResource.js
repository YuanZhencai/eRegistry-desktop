import axios from 'axios'

export function getCenterMember(id) {
  return axios({
    url: `/api/center-members/${id}`,
    method: 'get'
  })
}

export function getCenterMemberByMemberId(memberId) {
  return axios({
    url: `/api/members/${memberId}/center`,
    method: 'get'
  })
}

export function createCenterMember(centerMember) {
  return axios({
    url: `/api/center-members`,
    method: 'post',
    data: centerMember
  })
}

export function updateCenterMember(centerMember) {
  return axios({
    url: `/api/center-members`,
    method: 'put',
    data: centerMember
  })
}
