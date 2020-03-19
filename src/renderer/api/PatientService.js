import axios from 'axios'

export function getProjectPatients(projectId, params) {
  return axios({
    url: `/api/projects/${projectId}/patients`,
    method: 'get',
    params: params
  })
}

export function exportPatients(projectId, type) {
  return axios({
    url: `/api/projects/${projectId}/patients/data`,
    method: 'get',
    params: type
  })
}

export function getPatient(id) {
  return axios({
    url: `/api/patient/${id}`,
    method: 'get'
  })
}

export function deletePatient(id) {
  return axios({
    url: `/api/patient/${id}`,
    method: 'delete'
  })
}

export function createPatient(patient) {
  return axios({
    url: `/api/patient`,
    method: 'post',
    data: patient
  })
}

export function updatePatient(patient) {
  return axios({
    url: `/api/patient`,
    method: 'put',
    data: patient
  })
}

export function getTimeline(id) {
  return axios({
    url: `/api/patient/${id}/timeline`,
    method: 'get'
  })
}
