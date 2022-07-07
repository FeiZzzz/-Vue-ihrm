import request from '@/utils/request'

// 获取员工简单列表
export const reqGetEmployeeSimple = () => request({ url: '/sys/user/simple' })

// 获取员工综合列表
export function reqGetEmployeeList(page, size) {
  return request({
    method: 'get',
    url: '/sys/user',
    params: {
      page,
      size
    }
  })
}
// 根据id删除员工
export function reqDelEmployee(id) {
  return request({
    method: 'delete',
    url: `sys/user/${id}`
  })
}
