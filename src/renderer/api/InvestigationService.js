import axios from 'axios'

export function saveInvestigation(investigation) {
  return axios({
    url: `/api/questionnaire-investigations`,
    method: 'post',
    data: investigation
  })
}

export function getInvestigations(req) {
  return axios({
    url: `/api/investigations`,
    method: 'get',
    params: req
  })
}

export function getInvestigation(id) {
  return axios({
    url: `/api/investigations/${id}`,
    method: 'get'
  })
}
