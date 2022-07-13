<template>
  <div>
    <el-dialog v-loading="loading" :visible="showRoleDialog" title="分配角色" @close="handleClose" @open="handleOpen">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button type="primary" size="small" @click="setAssignRoles">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reqGetRoleList } from '@/api/setting'
import { reqGetUserDetailById } from '@/api/user'
import { reqGetAssignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      befault: false
    },
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 所有的角色
      roleList: [],
      // 选中的角色
      checkList: [],
      loading: false
    }
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('update:showRoleDialog', false)
      this.checkList = []
    },
    handleOpen() {
      this.loading = true
      //   this.getRoleList()
      //   this.getUserDetail()
      //   this.loading = false
      //   当两个异步都执行完毕 才会执行then()里面的回调函数
      Promise.all([this.getRoleList(), this.getUserDetail()]).then(() => {
        this.loading = false
      })
    },
    // 获取角色列表
    async getRoleList() {
      const { data: { rows }} = await reqGetRoleList(1, 1000)
      this.roleList = rows
    },
    // 获取员工已有的角色
    async  getUserDetail() {
      const { data: { roleIds }} = await reqGetUserDetailById(this.userId)
      //   console.log(res)
      this.checkList = roleIds || []
    //   console.log(roleIds)
    },
    // 给员工分配角色
    async setAssignRoles() {
      await reqGetAssignRoles({ id: this.userId, roleIds: this.checkList })
      this.$message.success('角色分配成功')
      this.handleClose()
    }

  }
}
</script>

<style>

</style>
