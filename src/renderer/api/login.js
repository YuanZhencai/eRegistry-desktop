import axios from 'axios'

export function login(username, password) {
  return axios({
    url: 'api/authenticate',
    method: 'post',
    data: {
      username,
      password
    },
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return {
        token: data.id_token
      }
    }]
  })
}

export function getInfo(token) {
  return axios({
    url: 'api/account',
    method: 'get',
    params: { token },
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return {
        roles: data.authorities,
        name: data.login,
        avatar: data.imageUrl,
        email: data.email,
        introduction: `${data.lastName} ${data.firstName}`
      }
    }]
  })
}

export function logout() {
  const redirect_uri = window.location.origin
  return axios.post(`api/logout`, redirect_uri)
}

export function oauth(source) {
  return axios({
    url: `oauth/login/${source}`,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    method: 'get'
  })
}
