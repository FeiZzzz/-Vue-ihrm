import Vue from 'vue'
// 重置css 样式
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 导入 Element-UI 样式 和英文版
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 自定义主题
import '@/styles/element-variables.scss'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 导入全局css样式
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// process 进程 env 环境
// console.log(process.env)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// // 引入 request 组件
// import request from '@/utils/request'
// // 挂载到原型对象
// Vue.prototype.$http = request

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// // 注册全局的自定义指令
// import { imgerror, color } from '@/dierctives'
// // Vue.directive('自定义指令',{钩子函数})
// Vue.directive('imgerror', imgerror)
// // 自定义全局颜色指令
// Vue.directive('color', color)

// 注册全局的自定义指令
import * as result from '@/dierctives'
// 第一种方法：循环注册  for in
/* for (const k in result) {
  Vue.directive(k, result[k])
} */

// 第二种方法  Object.keys
Object.keys(result).forEach(item => {
  Vue.directive(item, result[item])
})

import i18n from '@/lang'
// 配置ElementUI的中英切换逻辑
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// 全局注册组件
import Components from '@/components'
Vue.use(Components)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
