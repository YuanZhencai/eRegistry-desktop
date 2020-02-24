import request from '@/utils/request'

export function assignMemberTask(memberTasks) {
  return request({
    url: `/api/member-tasks/assign`,
    method: 'put',
    data: memberTasks,
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

export function createMemberTask(memberTask) {
  return request({
    url: `/api/member-tasks`,
    method: 'post',
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

export function getTaskByMemberId(memberId) {
  return request({
    url: `/api/members/${memberId}/task`,
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
