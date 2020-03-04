import request from '@/utils/request'

export function getProjectMembers(projectId, params) {
  return request({
    url: `/api/projects/${projectId}/members`,
    method: 'get',
    params: params
  })
}

export function getMember(id) {
  return request({
    url: `/api/members/${id}`,
    method: 'get'
  })
}

export function deleteMember(id) {
  return request({
    url: `/api/members/${id}`,
    method: 'delete'
  })
}

export function createBatchMember(batchMember) {
  return request({
    url: `/api/members/batch`,
    method: 'post',
    data: batchMember
  })
}

export function createMember(member) {
  return request({
    url: `/api/members`,
    method: 'post',
    data: member
  })
}

export function updateMember(member) {
  return request({
    url: `/api/members`,
    method: 'put',
    data: member
  })
}
