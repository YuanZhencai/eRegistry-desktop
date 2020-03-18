import request from '@/utils/request'
export function userFilter(id) {
  return request({
    url: `/api/projects/${id}/members`,
    method: 'get'
  })
}

export function changes(data) {
  return request(`/api/projects/${data.id}/changes`, {
    params: data,
    method: 'get'
  })
}
