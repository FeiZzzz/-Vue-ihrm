<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon :icon-class="isFullScreen ? 'exit-fullscreen' : 'fullscreen' " class="fullscreen" @click="toggle" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull/dist/screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullScreen: false
    }
  },
  methods: {
    toggle() {
      this.isFullScreen = !this.isFullScreen
      ScreenFull.toggle()
    }
  }
}
</script>
<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  fill: #fff;
  cursor: pointer;
}
</style>
