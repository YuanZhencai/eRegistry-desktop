import axios from 'axios'

export function getProjectMembers(projectId, params) {
  return axios({
    url: `api/projects/${projectId}/members`,
    method: 'get',
    params: params
  })
}

export function getMember(id) {
  return axios({
    url: `api/members/${id}`,
    method: 'get'
  })
}

export function deleteMember(id) {
  return axios({
    url: `api/members/${id}`,
    method: 'delete'
  })
}

export function createBatchMember(batchMember) {
  return axios({
    url: `api/members/batch`,
    method: 'post',
    data: batchMember
  })
}

export function createMember(member) {
  return axios({
    url: `api/members`,
    method: 'post',
    data: member
  })
}

export function updateMember(member) {
  return axios({
    url: `api/members`,
    method: 'put',
    data: member
  })
}
