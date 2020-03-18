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
// 随访计划的数据
export function getplanData(data) {
  return request({
    url: '/api/plans/?page=' + data.page + '&size=' + data.size + '&EQ_plan.projectId=' + data['EQ_plan.projectId'] + '&EQ_plan.deleted=' + data['EQ_plan.deleted'],
    method: 'get',
    data
  })
}
// 编辑数据
export function getedit(id) {
  return request({
    url: `/api/plans/${id}`,
    method: 'get'
  })
}
// 获取CRF列表
export function crflist() {
  return request({
    url: `/api/reports/mine`,
    method: 'get'
  })
}
// 删除随访记录
export function deleteData(id) {
  return request({
    url: `/api/plans/${id}`,
    method: 'delete'
  })
}
// 新建随访信息
export function postData(data) {
  return request({
    url: `/api/plans`,
    method: 'post',
    data
  })
}
// 编辑随访信息
export function putData(data) {
  return request({
    url: `/api/plans`,
    method: 'put',
    data
  })
}
