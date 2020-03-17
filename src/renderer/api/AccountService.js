import axios from 'axios'

export function saveAccount(user) {
  return axios({
    url: `/api/account`,
    method: 'post',
    data: user
  })
}

export function isAuthenticated() {
  return axios({
    url: `/api/authenticate`,
    method: 'get'
  })
}
