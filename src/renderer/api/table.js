import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/plans/list',
    method: 'get',
    params
  })
}
