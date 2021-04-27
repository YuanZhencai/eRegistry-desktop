import axios from 'axios'

export function getProviders() {
  return axios.get(`oauth/providers`)
}

