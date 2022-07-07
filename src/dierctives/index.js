export const imgerror = {
  inserted(el, binding) {
    // 当图片出现错误时，触发onerror 事件
    el.onerror = function() {
      el.src = binding.value
    }
  }
}

export const color = {
  inserted(el, binding) {
    imgerror
    el.style.color = binding.value
  }
}
