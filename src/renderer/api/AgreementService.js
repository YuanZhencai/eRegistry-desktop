import axios from 'axios'

export function getAgreement(patientId) {
  return axios.get(`api/projects/${patientId}/agreement`)
}

export function saveAgreement(event) {
  return axios.put(`api/agreements`, event)
}
