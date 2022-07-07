<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="handleCloseDialog" @open="handleOpen">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 具名插槽 -->
    <el-form ref="form" label-width="120px" :model="form" :rules="formRules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%;" placeholder="请选择">
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="
            部门介绍"
        prop="introduce"
      >
        <el-input v-model="form.introduce" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>

    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <template #footer>

      <el-button type="primary" size="small" @click="clickSubmit">确定</el-button>
      <el-button size="small" @click="handleCloseDialog">取消</el-button>

    </template>
  </el-dialog>
</template>

<script>
import { reqGetEmployeeSimple } from '@/api/employees'
import { reqAddDepartments, reqGetDepartDetail, reqUpdateDepartments } from '@/api/departments'
export default {

  name: 'Adddept',
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    nodeData: {
      type: Object,
      required: true
    },
    originData: {
      type: Array,
      required: true
    }

  },
  data() {
    // 统计部门中禁止出现重复部门 （如：财务部添加子部门）
    // 1.筛选财务部子部门
    // 2.判断添加新子部门是否在原子部门的数组中
    const checkNameRepeat = (rule, value, callback) => {
      // 定义一个空数组
      let arr = []

      if (this.form.id) {
        // ——————编辑
        // 1.部门名称与之前相同，放行
        if (this.nodeData.name === value) {
          callback()
          return
        }
        // 2.部门名称与同级部门相同,报错
        arr = this.originData.filter(item => this.nodeData.pid === item.pid)
      } else {
        // ——————新增
        arr = this.originData.filter(item => item.pid === this.nodeData.id)
      }

      // 2.判断添加新子部门是否在原子部门的数组中
      const repeat = arr.some(item => item.name === value)

      repeat ? callback(new Error('新增子部门不能重复')) : callback()
    }
    // 部门编码在整个模块中都不允许出现重复
    // 校验部门编码是否重复
    const checkCodeRepeat = (rule, value, callback) => {
      // this.form.id有值时是编辑状态，下载乃的code与原code相同时，放行
      if (this.form.id && this.nodeData.code === value) {
        callback()
        return
      }
      // 所有部门, 编码都唯一, 不管层级
      const repeat = this.originData.some(item => item.code === value)
      repeat ? callback(new Error(`已经有编码${value}的部门了`)) : callback()
      // console.log(repeat)
    }

    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      formRules: {
        name: [
          { required: true, trigger: 'blur', message: '请输入部门名称' },
          { min: 1, max: 50, trigger: ['change', 'blur'], message: '部门名称1-50位之间' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, trigger: ['change', 'blur'], message: '请输入部门编码' },
          { min: 1, max: 50, trigger: ['change', 'blur'], message: '部门编码1-50位之间' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, trigger: ['change', 'blur'], message: '请选择部门管理者' }

        ],
        introduce: [
          { required: true, trigger: ['change', 'blur'], message: '请输入部门介绍' },
          { min: 1, max: 300, trigger: ['change', 'blur'], message: '部门介绍1-300位之间' }
        ]
      },
      peoples: []
    }
  },
  // 通过计算属性控制标题
  computed: {
    showTitle() {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    // 点击关闭编辑弹窗的函数
    handleCloseDialog() {
      // 通知父组件关闭弹窗
      this.$emit('update:showDialog', false)
      // 清空表单
      this.$refs.form.resetFields()
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    // 打开弹框获取员工列表
    async  handleOpen() {
      const res = await reqGetEmployeeSimple()
      // console.log(res)
      this.peoples = res.data
    },
    // 提交表单数据
    clickSubmit() {
      this.$refs.form.validate(async valid => {
        // 1.兜底校验
        if (!valid) return
        // 判断是编辑还是新增
        if (this.form.id) {
          // 编辑
          await reqUpdateDepartments(this.form)
          this.$message.success('更新成功')
        } else {
          // 新增
          // 2.发送Ajax
          await reqAddDepartments({ ...this.form, pid: this.nodeData.id })
          // 3.提示
          this.$message.success('新增部门成功')
        }

        // 4.通知父组件刷新
        this.$emit('add-depts')
        // 5.关闭弹层
        this.handleCloseDialog()
      })
    },
    // 获取部门详情
    async getDepartDetail() {
      const res = await reqGetDepartDetail(this.nodeData.id)
      // 将点击编辑获取到的ajax赋值给form
      this.form = res.data
    }
  }
}
</script>

<style>

</style>
