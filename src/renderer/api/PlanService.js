import request from '@/utils/request'

export function findWithReport(planId) {
  return request({
    url: `/api/plans/report/${planId}`,
    method: 'get'
  })
}

export function saveWithReport(plan, report) {
  return request({
    url: `/api/plans/report`,
    method: 'put',
    data: {
      plan: plan,
      report: report
    }
  })
}
