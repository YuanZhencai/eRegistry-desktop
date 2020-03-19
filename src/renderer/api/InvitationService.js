import axios from 'axios'

export function createInvitation(data) {
  return axios({
    method: 'post',
    url: `/api/invitations/member`,
    data
  })
}
