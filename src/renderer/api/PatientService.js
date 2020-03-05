import request from '@/utils/request'

export function getProjectPatients(projectId, params) {
  return request({
    url: `/api/projects/${projectId}/patients`,
    method: 'get',
    params: params
  })
}

export function exportPatients(projectId, type) {
  return request({
    url: `/api/projects/${projectId}/patients/data`,
    method: 'get',
    params: type
  })
}

export function getPatient(id) {
  return request({
    url: `/api/patient/${id}`,
    method: 'get'
  })
}

export function deletePatient(id) {
  return request({
    url: `/api/patient/${id}`,
    method: 'delete'
  })
}

export function createPatient(patient) {
  return request({
    url: `/api/patient`,
    method: 'post',
    data: patient
  })
}

export function updatePatient(patient) {
  return request({
    url: `/api/patient`,
    method: 'put',
    data: patient
  })
}

export function getTimeline(id) {
  return request({
    url: `/api/patient/${id}/timeline`,
    method: 'get'
  })
}
