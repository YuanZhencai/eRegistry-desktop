import axios from 'axios'
export function userFilter(id) {
  return axios({
    url: `api/projects/${id}/members`,
    method: 'get'
  })
}

export function changes(data) {
  return axios(`api/projects/${data.id}/changes`, {
    params: data,
    method: 'get'
  })
}
