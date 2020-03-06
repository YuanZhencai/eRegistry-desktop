import request from '@/utils/request'

export function getAllPatientCases() {
  return request({
    url: `/api/patient-cases`,
    method: 'get'
  })
}

export function createPatientCase(data) {
  return request({
    url: `/api/patient-cases`,
    method: 'post',
    data
  })
}

export function updatePatientCase(data) {
  return request({
    url: `/api/patient-cases`,
    method: 'put',
    data
  })
}

export function deletePatientCase(id) {
  return request({
    url: `/api/patient-cases/${id}`,
    method: 'delete'
  })
}

export function getPatientCase(id) {
  return request({
    url: `/api/patient-cases/${id}`,
    method: 'get'
  })
}
