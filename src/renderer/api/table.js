import axios from 'axios'

export function getList(params) {
  return axios({
    url: '/api/plans/list',
    method: 'get',
    params
  })
}
