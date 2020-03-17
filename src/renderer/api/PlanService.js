import axios from 'axios'

export function findWithReport(planId) {
  return axios({
    url: `/api/plans/report/${planId}`,
    method: 'get'
  })
}

export function saveWithReport(plan, report) {
  return axios({
    url: `/api/plans/report`,
    method: 'put',
    data: {
      plan: plan,
      report: report
    }
  })
}
