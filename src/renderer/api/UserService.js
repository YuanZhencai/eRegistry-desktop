import axios from 'axios'

export function getUsersByLoginStartingWith(login) {
  return axios({
    url: '/api/users/starting-with',
    method: 'get',
    params: {
      login
    }
  })
}
