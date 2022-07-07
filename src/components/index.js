// 该文件负责所有的公共组件注册
// vue插件机制：Vue.use

import PageTools from '@/components/PageTools'

export default {
  install(Vue) {
    Vue.component('page-tools', PageTools)
  }
}
