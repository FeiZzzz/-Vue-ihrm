import request from '@/utils/request'

// 封装获取部门的函数
export const reqDepartMents = () => {
  return request({
    url: '/company/department'
  })
}

// 根据id删除部门
export const reqDelDepartment = (id) => {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}

// 新增部门
export const reqAddDepartments = (data) => {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

/** *
 * 获取部门详情
 * ***/
export function reqGetDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
/**
 * 编辑部门
 ***/
export function reqUpdateDepartments(obj) {
  return request({
    url: `/company/department/${obj.id}`,
    method: 'put',
    obj
  })
}
