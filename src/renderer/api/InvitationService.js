import axios from 'axios'

export function createInvitation(data) {
  return axios({
    method: 'post',
    url: `/api/invitations/member`,
    data
  })
}
export function activeInvitation(data) {
  return axios({
    method: 'post',
    url: `/api/invitations/active`,
    data
  })
}
export function getInvitation(key) {
  return axios({
    method: 'get',
    url: `/api/invitations/detail/${key}`
  })
}
