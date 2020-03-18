import request from '@/utils/request'
export function userFilter(id) {
  return request({
    url: `/api/projects/${id}/members`,
    method: 'get'
  })
}
export function changes(data) {
  return request({
    url: '/api/projects/' + data.id + '/changes?page=' + data.page + '&size=' + data.size + '&type=' + data.type + '&author=' + data.author,
    method: 'get'
  })
}
