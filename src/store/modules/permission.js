import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes
}

const mutations = {
  setRoutes(state, otherRoutes) {
    state.routes = [...constantRoutes, ...otherRoutes]
  }
}

const actions = {
  // 筛选路由权限
  filterRoutes(context, menus) {
    const otherRoutes = asyncRoutes.filter(item => {
      // 如果路由模块的首页name, 在menus数组中包含, 就是这个模块开放
      return menus.includes(item.children[0].name)
    })

    context.commit('setRoutes', otherRoutes)
    return otherRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
