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
const setupAxiosInterceptors = (i18n, onUnauthenticated) => {
  const messageService = new MessageService(i18n)

  const onResponseSuccess = res => {
    messageService.success(res)
    return res
  }

  const onResponseError = err => {
    if (err.response) {
      if (err.response.status === 403) {
        onUnauthenticated()
      }
      messageService.error(err)
    } else {
      messageService.error({
        response: {
          status: 0
        }
      })
    }
    return Promise.reject(err)
  }

  if (axios.interceptors) {
    axios.interceptors.request.use(onRequestSuccess)
    axios.interceptors.response.use(onResponseSuccess, onResponseError)
  }
}

export { onRequestSuccess, setupAxiosInterceptors }
