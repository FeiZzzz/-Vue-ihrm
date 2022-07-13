<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="role">
            <!-- 新增按钮 -->
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="showDialog=true"
            >
              新增角色
            </el-button>
            <!-- 角色表格 -->
            <el-table v-loading="loading" stripe :data="list">
              <el-table-column label="序号" width="150" type="index" :index="indexMethod" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template v-slot="{row}">
                  <el-button size="small" type="success" @click="handlePermission(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--
              角色数据分页
              current-page：当前页码值（现在在第几页）
              page-sizes：每页可显示的页码个数列表
              page-size：当页显示的每页数据条数
              layout：分页组件布局
              total：数据总条数

              @size-change：显示的数据总条数发生改变时触发
             @current-change：页码值发生改变时触发
              -->

            <el-pagination
              :current-page="page"
              :page-sizes="[2, 3, 5, 10]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="company">
            <!-- 警告信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 表单 -->
            <!-- 表单 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyForm.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyForm.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyForm.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyForm.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
      <!-- 新增角色弹出框 -->
      <el-dialog :title="showTitle" :visible="showDialog" @close="closeDialog">
        <el-form ref="roleForm" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入角色描述" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitBtn">确认</el-button>
        </template>
      </el-dialog>
      <!-- 分配角色的弹框 -->
      <el-dialog
        :visible="handlePermissionShowDialog"
        @close="PermissionHandleClose"
        @open="PermissionHandleOpen"
      >
        <el-tree :data="permissionList" :props="{label:'name'}" show-checkbox check-strictly />
        <template #footer>
          <div style="text-align: right;">
            <el-button @click="PermissionHandleClose">取消</el-button>
            <el-button type="primary">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { reqGetCompanyById } from '@/api/company'
import { reqGetRoleList, reqDeleteRole, reqAddRole, reqUpdateRole, reqGetRoleDetail } from '@/api/setting'
import { reqGetPermissionList } from '@/api/permission'
import { transListToTree } from '@/utils'
export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'role',
      list: [],
      total: 0, // 总条数
      page: 1, // 当前页
      pagesize: 3, // 每页条数

      loading: false, // 加载loading变量
      showDialog: false, // 控制新增角色弹出框的显示与隐藏
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigeer: ['blur', 'change'] }],
        description: [{ required: true, message: '请输入角色描述', trigeer: ['blur', 'change'] }]
      },
      companyForm: {},
      handlePermissionShowDialog: false,
      permissionList: []
    }
  },
  // 控制显示标题的计算属性
  computed: {
    ...mapState('user', ['userInfo']),
    showTitle() {
      return this.form.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取角色数据
    async getRoleList() {
      this.loading = true
      const { data: { rows, total }} = await reqGetRoleList(this.page, this.pagesize)
      this.total = total
      this.list = rows
      this.loading = false
    },
    // 显示的数据总条数发生改变时触发
    handleSizeChange(newPageSize) {
      // console.log('总条数发生变化')
      this.pagesize = newPageSize
      this.getRoleList()
    },
    // 页码值发生改变时触发
    handleCurrentChange(newPage) {
      // console.log('页码值发生改变了')
      this.page = newPage
      this.getRoleList()
    },
    // 自定义序号
    indexMethod(index) {
      return (this.page - 1) * this.pagesize + index + 1
    },
    // 根据id删除角色
    delRole(id) {
      // 询问是否删除
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await reqDeleteRole(id)
        //  成功提示
        this.$message.success('删除成功')
        if (this.list.length === 1 && this.page > 1) this.page--
        // 重新渲染数据
        this.getRoleList()
      })
    },
    // 关闭弹框
    closeDialog() {
      this.showDialog = false
      // 重置表单数据
      this.form = {
        name: '',
        description: ''
      }
      // 清空表单数据
      this.$refs.roleForm.resetFields()
    },
    // 添加&&编辑角色
    submitBtn() {
      // 兜底校验
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return
        // 判断是编辑还是删除
        if (this.form.id) {
          // 编辑角色
          // 发送ajax
          await reqUpdateRole(this.form)
          // 成功提示
          this.$message.success('更新角色成功')
        } else {
          // 新增角色
          // 发送ajax
          await reqAddRole(this.form)
          // 成功提示
          this.$message.success('添加角色成功')
        }

        // 关闭弹框
        this.closeDialog()
        // 重新渲染
        this.getRoleList()
      })
    },
    // 编辑角色
    async editRole(id) {
      const res = await reqGetRoleDetail(id)
      // console.log(res)
      this.form = res.data

      // 显示弹层
      this.showDialog = true
    },
    async getCompanyInfo() {
      const { data } = await reqGetCompanyById(this.userInfo.companyId)
      this.companyForm = data
    },
    // 分配角色权限
    handlePermission(roleId) {
      this.handlePermissionShowDialog = true
      console.log(roleId)
    },
    // 关闭分配权限的弹框
    PermissionHandleClose() {
      this.handlePermissionShowDialog = false
    },
    // 获取角色权限
    async getPermissionList() {
      const { data } = await reqGetPermissionList()
      this.permissionList = transListToTree(data, '0')
    },
    PermissionHandleOpen() {
      this.getPermissionList()
    }
  }
}
</script>

<style>

</style>
