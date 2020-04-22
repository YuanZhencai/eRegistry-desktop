import axios from 'axios'

export function saveAccount(user) {
  return axios({
    url: `/api/account`,
    method: 'post',
    data: user
  })
}
export function getAccount() {
  return axios({
    url: `/api/account`,
    method: 'get'
  })
}
export function isAuthenticated() {
  return axios({
    url: `/api/authenticate`,
    method: 'get'
  })
}
export function registerAccount(data) {
  return axios({
    url: `/api/register`,
    method: 'post',
    data: data
  })
}
export function activateAccount(params) {
  return axios({
    url: `/api/activate`,
    method: 'get',
    params
  })
}
export function changePassword(data) {
  return axios({
    url: `/api/account/change-password`,
    method: 'post',
    data: data
  })
}
export function requestPasswordReset(data) {
  return axios({
    url: `/api/account/reset-password/init`,
    method: 'post',
    data: data
  })
}
export function finishPasswordReset(data) {
  return axios({
    url: `/api/account/reset-password/finish`,
    method: 'post',
    data: data
  })
}
