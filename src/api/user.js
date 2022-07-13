import request from '@/utils/request'

// 用户登录
export const reqLogin = (data) => {
  return request({
    method: 'post',
    // 改造 url
    // 第一步：删除请求的服务器地址  自动的拼接浏览器中的服务器名： http://localhost:8080/
    //  http://localhost:8080/dev-api/api/sys/login 没有任何操作 获取不到数据
    // 第二步： http://localhost:8080/api/sys/login  这是改造后的地址
    // 最终请求地址 /api/sys/login => http://ihrm-java.itheima.net/api/sys/login
    url: '/sys/login', // 这里的 /api 由于开发环境所有接口都要加, 通过baseUrl加
    data
  })
}

//  获取用户基本资料
export function reqGetUserInfo(token) {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}
// 获取用户的全部信息 补全
export function reqGetUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

