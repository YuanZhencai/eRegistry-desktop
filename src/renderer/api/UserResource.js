import request from '@/utils/request'

export function getUsersByLoginStartingWith(login) {
  return request({
    url: '/api/users/starting-with',
    method: 'get',
    params: {
      login
    },
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
