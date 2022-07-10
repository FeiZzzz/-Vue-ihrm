// 该文件负责所有的公共组件注册
// vue插件机制：Vue.use

import PageTools from '@/components/PageTools'
// excel组件
import UploadExcel from '@/components/UploadExcel'
// 图片上传组件
import ImageUpload from '@/components/ImageUpload'
export default {
  // 进行组件的全局注册
  install(Vue) {
    Vue.component('PageTools', PageTools)// 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册图片上传组件
  }
}
