import axios from 'axios'

export function findUsers(req) {
  return axios({
    method: 'get',
    url: `api/users`,
    params: req
  })
}
export function createUser(user) {
  return axios({
    method: 'post',
    url: `api/users`,
    data: user
  })
}
export function search(login) {
  return axios({
    method: 'get',
    url: `api/users/${login}`
  })
}
export function updateUser(user) {
  return axios({
    method: 'put',
    url: `api/users`,
    data: user
  })
}
export function remove(userId) {
  return axios({
    method: 'delete',
    url: `api/users/${userId}`
  })
}
export function changePassword(user) {
  return axios({
    method: 'post',
    url: `api/users/change-password`,
    data: user
  })
}
export function retrieveAuthorities() {
  return axios({
    method: 'get',
    url: `api/users/authorities`
  })
}
