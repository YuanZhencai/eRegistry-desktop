import axios from 'axios'
export function getsettings() {
  return axios({
    url: `api/account`,
    method: 'get'
  })
}
export function createSettings(data) {
  return axios({
    url: `api/account`,
    method: 'post',
    data
  })
}
export function upload(data) {
  return axios({
    url: `api/images/upload`,
    method: 'post',
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
