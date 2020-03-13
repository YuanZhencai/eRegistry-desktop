import { buldeGetPath } from './Calendar.js'

export const LOGGING = {
  // 用户名筛选
  userFiltrate: (id) => `/api/projects/${id}/members`,
  changes: (data) => buldeGetPath(data, `/api/projects/${data.id}/changes`, 'id')
}
