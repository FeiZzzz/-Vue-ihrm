import { reqLogin, reqGetUserInfo, reqGetUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = () => {
  return {
    // 一进来优先从缓存中取
    token: getToken(), // token字符串
    userInfo: {}
  }
}
const mutations = {
  // 获取token
  getToken(state, newToken) {
    state.token = newToken
    // 设置了 token 的同时, 同步到本地cookies中
    setToken(newToken)
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 清除token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 清除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  // 登录
  async login(context, data) {
    const res = await reqLogin(data)
    context.commit('getToken', res.data)
    // return res
  },
  // 获取用户信息
  async getUserInfo(context) {
    const { data: res1 } = await reqGetUserInfo() // data 就是用户基本的资料
    const { data: res2 } = await reqGetUserDetailById(res1.userId) // 包含头像的资料
    // console.log(res)
    const res = { ...res1, ...res2 }
    // console.log(res)
    context.commit('setUserInfo', res)
    return res
  },
  // 退出
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
