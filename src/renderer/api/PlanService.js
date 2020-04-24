import axios from 'axios'

export function findWithReport(planId) {
  return axios({
    url: `api/plans/report/${planId}`,
    method: 'get'
  })
}

export function saveWithReport(plan, report) {
  return axios({
    url: `api/plans/report`,
    method: 'put',
    data: {
      plan: plan,
      report: report
    }
  })
}
// 随访计划的数据
export function getPlan(data) {
  return axios('api/plans', {
    params: data,
    method: 'get'
  })
}
// 编辑数据
export function getPlans(id) {
  return axios({
    url: `api/plans/${id}`,
    method: 'get'
  })
}
// 获取CRF列表
export function getCrfList() {
  return axios({
    url: `api/reports/mine`,
    method: 'get'
  })
}
// 删除随访记录
export function deletePlan(id) {
  return axios({
    url: `api/plans/${id}`,
    method: 'delete'
  })
}
// 新建随访信息
export function createPlan(data) {
  return axios({
    url: `api/plans`,
    method: 'post',
    data
  })
}
// 编辑随访信息
export function updatePlan(data) {
  return axios({
    url: `api/plans`,
    method: 'put',
    data
  })
}
