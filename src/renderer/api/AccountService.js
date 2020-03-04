import request from '@/utils/request'

export function saveAccount(user) {
  return request({
    url: `/api/account`,
    method: 'post',
    data: user
  })
}

export function isAuthenticated() {
  return request({
    url: `/api/authenticate`,
    method: 'get'
  })
}
