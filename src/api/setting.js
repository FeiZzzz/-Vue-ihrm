import request from '@/utils/request'
/**
 * 获取角色列表
 * 设置默认值
 * ***/

export function reqGetRoleList(page = 1, pagesize = 10) {
  return request({
    method: 'get',
    url: '/sys/role',
    params: {
      page,
      pagesize
    }
  })
}
// 根据id删除角色
export function reqDeleteRole(id) {
  return request({
    method: 'delete',
    url: `/sys/role/${id}`

  })
}
// 新增角色
export function reqAddRole(data) {
  return request({
    method: 'post',
    url: '/sys/role',
    data

  })
}
/**
 * 根据 id 获取角色详情, 用于回显
 * **/
export function reqGetRoleDetail(id) {
  return request({
    method: 'get',
    url: `/sys/role/${id}`
  })
}
/** *
 * 修改角色
 * **/
export function reqUpdateRole(data) {
  return request({
    method: 'put',
    url: `/sys/role/${data.id}`,
    data
  })
}

