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

// 新增员工接口
export const reqAddEmployee = (data) => {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/** *
 * 封装一个批量导入员工的接口
 * data: [{}, {}, {}, {}, ... ]
 * ***/
export const reqImportEmployee = (data) => {
  return request({
    method: 'post',
    url: '/sys/user/batch',
    data
  })
}

// 获取用户基本信息 补全
export function reqGetUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
// 更新用户的资料
export const reqSaveUserDetailById = (data) => {
  return request({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })
}

/** *
 *  读取用户详情的基础信息 (个人详情-下面的接口)
 * **/
export function reqGetPersonalDetail(id) {
  return request({
    method: 'get',
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息 (个人详情-下面的接口)
 * **/
export function reqUpdatePersonal(data) {
  return request({
    method: 'put',
    url: `/employees/${data.userId}/personalInfo`,
    data
  })
}

/** **
 * 获取用户的岗位信息  (岗位信息)
 * ****/
export function reqGetJobDetail(id) {
  return request({
    method: 'get',
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息  (岗位信息)
 * ****/
export function reqUpdateJob(data) {
  return request({
    method: 'put',
    url: `/employees/${data.userId}/jobs`,
    data
  })
}
