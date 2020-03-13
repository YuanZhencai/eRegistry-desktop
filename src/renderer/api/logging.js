import { buldeGetPath } from './Calendar.js'

export const LOGGING = {
  // 用户名筛选
  userFilter: (id) => `/api/projects/${id}/members`,
  // 过滤条件
  changes: (data) => buldeGetPath(data, `/api/projects/${data.id}/changes`, 'id')
}
