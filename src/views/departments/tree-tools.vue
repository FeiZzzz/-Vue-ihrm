<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width:100%;">
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <!-- 两个内容 -->
        <el-col :span="12">{{ nodeData.manager }}</el-col>
        <el-col :span="12">
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { reqDelDepartment } from '@/api/departments'
export default {
  name: 'TreeTools',

  props: {
    nodeData: {
      type: Object,
      required: true
    },
    // 是否根节点
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand(type) {
      // 删除部门
      if (type === 'del') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
          // type: 'warning'
        }).then(async() => {
          // 1.发送ajax删除部门
          await reqDelDepartment(this.nodeData.id)
          // 2.提示用户
          this.$message.success('删除部门成功')
          // 3.提醒父组件重新获取部门
          this.$emit('del-depts')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
      // 新增部门
      if (type === 'add') {
        // 将nodeData传递过去
        this.$emit('add-depts', this.nodeData)
      }
      // 编辑部门
      if (type === 'edit') {
        this.$emit('close-dialog', this.nodeData)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
