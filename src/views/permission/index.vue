<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="add(1,'0')">添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button v-if="row.type===1" size="small" type="text" @click="add(2,row.id)">添加权限点</el-button>
              <el-button size="small" type="text" @click="getPermissionDetail(row.id)">查看</el-button>
              <el-button size="small" type="text" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 新增编辑的弹层 -->
    <el-dialog :visible="showDialog" :title="title" @close="handleClose">
      <!-- 表单内容 -->
      <el-form label-width="100px">
        <el-form-item label="权限名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right;">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="clickSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reqGetPermissionList, reqAddPermission, reqDelPermission, reqGetPermissionDetail, reqUpdatePermission } from '@/api/permission'
import { transListToTree } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      value: false, // 开关
      formData: {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }

    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑权限' : '添加权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async  getPermissionList() {
      const { data } = await reqGetPermissionList()
      // console.log(data)
      // 转换为树状列表
      this.list = transListToTree(data, '0')
    },
    // 关闭弹窗的回调
    handleClose() {
      // 清空表单
      this.formData = {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
      this.showDialog = false
    },
    // 新增权限
    add(type, id) {
      // console.log(type, id)
      this.formData.type = type
      this.formData.pid = id
      this.showDialog = true
      // console.log(this.formData)
    },
    // 提交权限
    async clickSubmit() {
      // 判断是添加还是编辑
      if (this.formData.id) {
        // 有就是编辑

        await reqUpdatePermission(this.formData)

        this.$message.success('编辑权限成功')
      } else {
        // 添加操作
        await reqAddPermission(this.formData)
        // 重新获取列表
        this.$message.success('添加权限成功')
        // 关闭dialog
      }
      this.handleClose()
      this.getPermissionList()
    },
    // 删除权限
    async del(id) {
      await reqDelPermission(id)
      // 重新获取列表
      this.getPermissionList()
      this.$message.success('删除权限成功')
    },
    // 获取权限详情
    async getPermissionDetail(id) {
      this.showDialog = true
      const { data } = await reqGetPermissionDetail(id)
      // console.log(data)
      this.formData = data
      // console.log(this.formData)
    }
    // 更新数据

  }
}
</script>
