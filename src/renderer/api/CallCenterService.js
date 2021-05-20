import axios from 'axios'

export function callPatient(data) {
  return axios.post(`api/call-center/call-patient`, data)
}

