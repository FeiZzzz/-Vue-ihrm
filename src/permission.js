// 路由前置守卫
import router from '@/router'
import store from '@/store'

// 引入进度条组件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 定义白名单  所有不受权限控制的页面
const whiteList = ['/login', '/404']

// 导航前置守卫
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 获取token
  const token = store.getters.token
  // 判断是否有token
  if (token) {
    // 有 token
    if (to.path === '/login') {
      // 是登录 页面，不让去，跳转到主页
      next('/')
      //   手动关闭进度条
      NProgress.done()
    } else {
      // 不是登录页，放行
      // 正常放行, 正常访问首页等内部页面, 需要获取用户信息
      // 如果当前vuex中已经有用户资料了, 就不需要再获取了 (没必要重复获取资料)
      if (!store.state.user.userInfo.userId) {
        const res = await store.dispatch('user/getUserInfo')
        // console.log(res)
        const otherRoutes = await store.dispatch('permission/filterRoutes', res.roles.menus)
        // console.log(otherRoutes)
        // 1.登陆时，我们已经知道了用户有哪个标识
        // 2.根据这些标识过滤动态路由 ["employees","settings","permissions"]
        // 3.过滤动态路由再添加到路由规则中  router.addRoutes([路由对象])
        router.addRoutes([
          ...otherRoutes,
          { path: '*', redirect: '/404', hidden: true }
        ]) // 动态添加路由是异步的
        next({ // 重新进入一次
          ...to,
          replace: true
        })
        // console.log(to)
      }
      next()
    }
  } else {
    // 没有 token
    if (whiteList.includes(to.path)) {
      // 去白名单
      // 放行
      next()
    } else {
      // 不是去白名单
      // 跳转到 登录页
      next('/login')
      //   手动关闭进度条
      NProgress.done()
    }
  }
})

// 路由后置守卫
router.afterEach((to, from) => {
  // 关闭进度条
  setTimeout(() => {
    NProgress.done()
  }, 500)
})
