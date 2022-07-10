// 员工模块
import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    },
    {
      path: 'detail/:id', // :id 路由占位符 动态路由
      hidden: true,
      component: () => import('@/views/employees/detail')
    }
  ]
}
