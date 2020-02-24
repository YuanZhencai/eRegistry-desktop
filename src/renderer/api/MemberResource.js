import request from '@/utils/request'

export function getProjectMembers(projectId, params) {
  return request({
    url: `/api/projects/${projectId}/members`,
    method: 'get',
    params: params,
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

export function getMember(id) {
  return request({
    url: `/api/members/${id}`,
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

export function deleteMember(id) {
  return request({
    url: `/api/members/${id}`,
    method: 'delete',
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

export function createBatchMember(batchMember) {
  return request({
    url: `/api/members/batch`,
    method: 'post',
    data: batchMember,
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

export function createMember(member) {
  return request({
    url: `/api/members`,
    method: 'post',
    data: member,
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

export function updateMember(member) {
  return request({
    url: `/api/members`,
    method: 'put',
    data: member,
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
