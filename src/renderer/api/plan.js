// data 請求的參數，path get請求的路徑, filterData 不進入請求的參數
// const buldeGetPath = (data, path, filterData) => {
//   // 獲取 有值的參數，過濾掉沒有值的參數
//   const haveKeys = Object.keys(data).filter(i => {
//     return data[i] && i !== filterData
//   })
//
//   let newPath = path
//   haveKeys.forEach((i, index) => {
//     if (index === 0) {
//       newPath += ('?' + i + '=' + data[i])
//     } else {
//       newPath += ('&' + i + '=' + data[i])
//     }
//   })
//
//   return newPath
// }
export const PLAN = {

  // 随访计划的数据
  planData: (data) => '/api/plans/?page=' + data.page + '&size=' + data.size + '&EQ_plan.projectId=' + data['EQ_plan.projectId'] + '&EQ_plan.deleted=' + data['EQ_plan.deleted'],
  // 编辑数据
  edit: (id) => `/api/plans/${id}`,
  // 获取CRF列表
  crflist: () => `/api/reports/mine`,
  // 删除随访记录
  deleteData: (id) => `/api/plans/${id}`,
  // 确认编辑信息
  putData: `/api/plans`
  // 新建随访计划
  // 日志记录
  // ecord: (data) => buldeGetPath(data, `/api/projects/${data.id}/changes`, 'id')
}

