import request from '@/utils/request'

export function assignMemberTask(memberTask) {
  return request({
    url: `/api/member-tasks/assign`,
    method: 'put',
    data: memberTask,
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

export function updateMemberTask(memberTask) {
  return request({
    url: `/api/member-tasks`,
    method: 'put',
    data: memberTask,
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
