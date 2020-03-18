import axios from 'axios'
import store from '../store'
import MessageService from '../shared/message/message-service'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000, // 请求超时时间
  withCredentials: true // 跨域
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = `Bearer ${store.getters.token}`// 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器

const messageService = new MessageService()

service.interceptors.response.use(
  response => {
    messageService.success(response)
    return response
  },
  error => {
    messageService.error(error)
    return Promise.reject(error)
  }
)

export default service
