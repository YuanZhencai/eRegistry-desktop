import axios from 'axios'

export function getAllFollows(params) {
  return axios({
    url: `/api/follows`,
    method: 'get',
    params
  })
}

export function createFollow(data) {
  return axios({
    url: `/api/follows`,
    method: 'post',
    data
  })
}

export function updateFollow(data) {
  return axios({
    url: `/api/follows`,
    method: 'put',
    data
  })
}

export function getFollow(id) {
  return axios({
    url: `/api/follows/${id}`,
    method: 'get'
  })
}

export function deleteFollow(id) {
  return axios({
    url: `/api/follows/${id}`,
    method: 'delete'
  })
}

export function getFollowEvents(projectId) {
  return axios({
    url: `/api/follows/events/${projectId}`,
    method: 'get'
  })
}

export function getFollowRemindingCases() {
  return axios({
    url: `/api/follows/reminds`,
    method: 'get'
  })
}

export function getPlanFollows(planId) {
  return axios({
    url: `/api/plans/${planId}/follows`,
    method: 'get'
  })
}

