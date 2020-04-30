import axios from 'axios'
export function saveAvatar(data) {
  return axios({
    url: `api/avatars`,
    method: 'put',
    data
  })
}

export function changePassword(data) {
  return axios({
    url: `api/account/change-password`,
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    data
  })
}
