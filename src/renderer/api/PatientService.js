import axios from 'axios'

export function getProjectPatients(projectId, params) {
  return axios({
    url: `api/projects/${projectId}/patients`,
    method: 'get',
    params: params
  })
}

export function getPatient(id) {
  return axios({
    url: `api/patient/${id}`,
    method: 'get'
  })
}

export function deletePatient(id) {
  return axios({
    url: `api/patient/${id}`,
    method: 'delete'
  })
}

export function createPatient(patient) {
  return axios({
    url: `api/patient`,
    method: 'post',
    data: patient
  })
}

export function updatePatient(patient) {
  return axios({
    url: `api/patient`,
    method: 'put',
    data: patient
  })
}

export function getTimeline(id) {
  return axios({
    url: `api/patient/${id}/timeline`,
    method: 'get'
  })
}

export function fillCase(patientCase) {
  return axios({
    url: `api/patient/case`,
    method: 'post',
    data: patientCase
  })
}

export function fillFollow(follow) {
  return axios({
    url: `api/patient/follow`,
    method: 'post',
    data: follow
  })
}

export function fillInvestigation(follow) {
  return axios({
    url: `api/patient/investigation`,
    method: 'post',
    data: follow
  })
}
