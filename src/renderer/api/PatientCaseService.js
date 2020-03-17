import axios from 'axios'

export function getAllPatientCases() {
  return axios({
    url: `/api/patient-cases`,
    method: 'get'
  })
}

export function createPatientCase(data) {
  return axios({
    url: `/api/patient-cases`,
    method: 'post',
    data
  })
}

export function updatePatientCase(data) {
  return axios({
    url: `/api/patient-cases`,
    method: 'put',
    data
  })
}

export function deletePatientCase(id) {
  return axios({
    url: `/api/patient-cases/${id}`,
    method: 'delete'
  })
}

export function getPatientCase(id) {
  return axios({
    url: `/api/patient-cases/${id}`,
    method: 'get'
  })
}
