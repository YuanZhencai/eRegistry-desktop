import axios from 'axios'

export function getAllAudits(params) {
  return axios({
    url: `api/audits`,
    method: 'get',
    params
  })
}

export function createAudit(data) {
  return axios({
    url: `api/audits`,
    method: 'post',
    data
  })
}

export function updateAudit(data) {
  return axios({
    url: `api/audits`,
    method: 'put',
    data
  })
}

export function getAudit(id) {
  return axios({
    url: `api/audits/${id}`,
    method: 'get'
  })
}

export function deleteAudit(id) {
  return axios({
    url: `api/audits/${id}`,
    method: 'delete'
  })
}

export function changeAudit(data) {
  return axios({
    url: `api/audits/change`,
    method: 'post',
    data
  })
}

export function recordAudit(data) {
  return axios({
    url: `api/audits/record`,
    method: 'post',
    data
  })
}

export function withdrawalAudit(data) {
  return axios({
    url: `api/audits/withdrawal`,
    method: 'post',
    data
  })
}
