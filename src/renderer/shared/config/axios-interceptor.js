import axios from 'axios'

import { SERVER_API_URL } from '@/constants'
import store from '../../store'
import MessageService from '../message/message-service'

const TIMEOUT = 1000000

const onRequestSuccess = config => {
  const token = store.getters.token
  if (token) {
    if (!config.headers) {
      config.headers = {}
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  config.timeout = TIMEOUT
  config.url = `${SERVER_API_URL}${config.url}`
  return config
}
const setupAxiosInterceptors = (vue, onUnauthenticated) => {
  const messageService = new MessageService(vue)

  const onResponseSuccess = res => {
    messageService.success(res)
    return res
  }

  const onResponseError = err => {
    const status = err.status || err.response.status
    if (status === 403 || status === 401) {
      onUnauthenticated()
    } else {
      messageService.error(err)
    }
    return Promise.reject(err)
  }

  if (axios.interceptors) {
    axios.interceptors.request.use(onRequestSuccess)
    axios.interceptors.response.use(onResponseSuccess, onResponseError)
  }
}

export { onRequestSuccess, setupAxiosInterceptors }
