import request from '@/utils/request'
export function getMineReports() {
  return request({
    url: `/api/reports/mine`,
    method: 'get'
  })
}
