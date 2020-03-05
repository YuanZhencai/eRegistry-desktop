import request from '@/utils/request'

export function assignMemberTask(memberTasks) {
  return request({
    url: `/api/member-tasks/assign`,
    method: 'put',
    data: memberTasks
  })
}

export function createMemberTask(memberTask) {
  return request({
    url: `/api/member-tasks`,
    method: 'post',
    data: memberTask
  })
}

export function updateMemberTask(memberTask) {
  return request({
    url: `/api/member-tasks`,
    method: 'put',
    data: memberTask
  })
}

export function getTaskByMemberId(memberId) {
  return request({
    url: `/api/members/${memberId}/task`,
    method: 'get'
  })
}
