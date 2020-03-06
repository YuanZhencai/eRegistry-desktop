import request from '@/utils/request'

export function getAllFollows(params) {
  return request({
    url: `/api/follows`,
    method: 'get',
    params
  })
}

export function createFollow(data) {
  return request({
    url: `/api/follows`,
    method: 'post',
    data
  })
}

export function updateFollow(data) {
  return request({
    url: `/api/follows`,
    method: 'put',
    data
  })
}

export function getFollow(id) {
  return request({
    url: `/api/follows/${id}`,
    method: 'get'
  })
}

export function deleteFollow(id) {
  return request({
    url: `/api/follows/${id}`,
    method: 'delete'
  })
}

export function getFollowEvents(projectId) {
  return request({
    url: `/api/follows/events/${projectId}`,
    method: 'get'
  })
}

export function getFollowRemindingCases() {
  return request({
    url: `/api/follows/reminds`,
    method: 'get'
  })
}

export function getPlanFollows(planId) {
  return request({
    url: `/api/plans/${planId}/follows`,
    method: 'get'
  })
}

