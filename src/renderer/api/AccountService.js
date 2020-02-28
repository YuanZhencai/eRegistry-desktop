import request from '@/utils/request'
export function getAccount() {
  return request({
    url: `/api/account`,
    method: 'get',
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}

export function saveAccount(user) {
  return request({
    url: `/api/account`,
    method: 'post',
    data: user,
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}

export function isAuthenticated() {
  return request({
    url: `/api/authenticate`,
    method: 'get',
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}
