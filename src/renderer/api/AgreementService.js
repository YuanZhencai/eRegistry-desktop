import axios from 'axios'

export function getAgreement(patientId) {
  return axios.get(`api/projects/${patientId}/agreement`)
}

export function saveAgreement(agreement) {
  return axios.put(`api/agreements`, agreement)
}
