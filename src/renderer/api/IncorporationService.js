import axios from 'axios'

export function getIncorporationPatient(projectId) {
  return axios.get(`api/ma/patient/incorporation/${projectId}`)
}

export function incorporationPatient(patient) {
  return axios.post(`api/ma/patient/incorporation`, patient)
}
