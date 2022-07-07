<script>
// 组件必须有结构：有两种方式渲染结构
// 1.template 渲染结构
// 2.reder 渲染函数结构
export default {
  name: 'MenuItem',
  functional: true, // 函数式组件 没有this
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) { // render函数的返回值就是当前组件结构
    const { icon, title } = context.props
    const vnodes = []
    // 如果有icon 添加icon
    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // svg-icon字体图标组件 用了svg精灵图
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
