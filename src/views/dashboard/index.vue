<template>
  <div>
    <el-checkbox-group v-model="list">
      <el-checkbox label="1" />
      <el-checkbox label="2">曹</el-checkbox>
      <el-checkbox label="3" />
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      list: ['1']
    }
  }
}
</script>

<style>

</style>
