<template>
  <el-dialog title="新增员工" :visible="showDialog" top="8vh" @close="closeDialog" @click.native="showtree=false">
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <!-- el-date-picker  日期选择器 -->
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :value="item.id" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input :value="formData.departmentName" style="width:50%" placeholder="请选择部门" @click.native.stop="getDepartments" />
        <!-- el-tree数据 -->
        <div v-if="showtree" class="tree-box">
          <el-tree v-loading="loading" :data="treeData" :props="{label:'name'}" @node-click="handleNodeClick" />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitAdd">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqDepartMents } from '@/api/departments'
import { transListToTree } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { reqAddEmployee } from '@/api/employees'
export default {
  name: 'HrsaasAddEmployee',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      // 定义数组接收树状数据
      treeData: [],
      loading: false, // 加载进度变量(加载中)
      showtree: false, // 控制树状结构显示隐藏
      EmployeeEnum
    }
  },

  methods: {
    // 关闭dialog
    closeDialog() {
      // 重置原来的数据
      this.formData = {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
      this.$refs.addForm.resetFields()
      // 通知父组件关闭
      this.$emit('update:showDialog', false)
    },
    // 获取组织结构，并转换树状图
    async  getDepartments() {
      this.loading = true
      this.showtree = !this.showtree
      if (!this.showtree) return
      // 获取部门列表数据
      const { data: { depts }} = await reqDepartMents()
      // console.log(depts)
      // 将列表数据转换树状数据
      this.treeData = transListToTree(depts, '')
      this.loading = false
      // console.log(this.treeData)
    },

    handleNodeClick(nodeData) {
      // 该还有子节点, 就是展开操作, 不管
      // console.log(nodeData)
      if (nodeData.children && nodeData.children.length > 0) return
      this.formData.departmentName = nodeData.name
      // 选择完毕后关闭
      this.showtree = false
    },
    // 新增员工
    submitAdd() {
      // 表单校验
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 发送ajax
        await reqAddEmployee(this.formData)
        // 关闭弹窗
        this.closeDialog()
        // 成功提示
        this.$message.success('添加成功')
        // 通知父组件更新数据
        this.$parent.getEmployeeList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: absolute;
  width: 50%;
  min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  overflow: hidden;
  background-color: #fff;
  max-height: 200px;
  overflow: auto;
  ::v-deep {
    .el-tree-node__content {
      height: auto;
    }
  }
}
</style>
