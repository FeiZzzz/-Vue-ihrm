// 该文件负责所有的公共组件注册
// vue插件机制：Vue.use

import PageTools from '@/components/PageTools'
// excel组件
import UploadExcel from '@/components/UploadExcel'
// 图片上传组件
import ImageUpload from '@/components/ImageUpload'
// 全屏的组件
import ScreenFull from '@/components/ScreenFull'
// 自定义主题颜色的组件
import ThemePicker from '@/components/ThemePicker'
// 中英文切换组件
import Lang from '@/components/Lang'
// 多页签组件
import TagsView from '@/components/TagsView'
export default {
  // 进行组件的全局注册
  install(Vue) {
    Vue.component('PageTools', PageTools)// 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册图片上传组件
    Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
    Vue.component('ThemePicker', ThemePicker) // 注册自定义主题组件
    Vue.component('Lang', Lang) // 注册中英文组件
    Vue.component('TagsView', TagsView) // 多页签组件
  }
}
