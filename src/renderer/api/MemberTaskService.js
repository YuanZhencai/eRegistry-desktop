import axios from 'axios'

export function assignMemberTask(memberTasks) {
  return axios({
    url: `api/member-tasks/assign`,
    method: 'put',
    data: memberTasks
  })
}

export function createMemberTask(memberTask) {
  return axios({
    url: `api/member-tasks`,
    method: 'post',
    data: memberTask
  })
}

export function updateMemberTask(memberTask) {
  return axios({
    url: `api/member-tasks`,
    method: 'put',
    data: memberTask
  })
}

export function getTaskByMemberId(memberId) {
  return axios({
    url: `api/members/${memberId}/task`,
    method: 'get'
  })
}
