import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(function(config) {
  const token = store.getters.token
  if (token) {
    // 如果token存在 注入token
    config.headers.Authorization = 'Bearer ' + token
  }
  // 在发送请求之前做些什么
  return config
}, function(error) {
  // 对请求错误做点什么
  return Promise.reject(error)
}
)

// 响应拦截器
service.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  const res = response.data
  const { message, success } = res
  if (!success) {
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message)) // 业务已经错误了, 应该进catch
  }
  return res
}, function(error) {
  // 对响应错误做点什么, 服务器错误, 400, 404, 500
  console.dir(error) // 便于调试
  // token 过期了
  if (error.response.status === 401 && error.response.data.code === 10002) {
    // token 过期了
    Message.error('登录状态失效,请重新登录')
    // 清除token 和用户信息
    store.dispatch('user/logout')
    // 跳转到登录页
    router.push('/login')
  } else {
    // 其他的错误信息
    Message.error(error.message) // 提示错误消息
  }

  return Promise.reject(error)
})
export default service
