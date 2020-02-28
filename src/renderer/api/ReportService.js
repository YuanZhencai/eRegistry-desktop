import request from '@/utils/request'
export function getMineReports() {
  return request({
    url: `/api/reports/mine`,
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
