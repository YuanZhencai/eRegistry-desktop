import axios from 'axios'

export function getInit(data) {
  return axios({
    method: 'get',
    url: `api/users`,
    data
  })
}
export function create(user) {
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
export function update(user) {
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
export function modify(password) {
  return axios({
    method: 'post',
    url: `api/users/change-password`,
    data: password
  })
}
export function retrieveAuthorities() {
  return axios({
    method: 'get',
    url: `api/users/authorities`
  })
}
