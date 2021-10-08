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

export function nickname(user) {
  const lastName = user.lastName
  const firstName = user.firstName
  if (!lastName && !firstName) {
    return user.login
  }
  return `${lastName || ''}${firstName || ''}`
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
        nickname: nickname(data),
        avatar: data.imageUrl,
        email: data.email,
        introduction: `${data.lastName} ${data.firstName}`
      }
    }]
  })
}

export function logout() {
  return axios.post(`api/logout`)
}

