import request from '@/utils/request'

export function getProjectUsers(id) {
  return request({
    url: `/api/projects/${id}/users`,
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
