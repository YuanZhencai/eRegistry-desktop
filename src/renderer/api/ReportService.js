import request from '@/utils/request'

export function getMineReports() {
  return request({
    url: `/api/reports/mine`,
    method: 'get'
  })
}

export function getReports(req) {
  return request({
    url: `/api/reports`,
    method: 'get',
    params: req
  })
}
