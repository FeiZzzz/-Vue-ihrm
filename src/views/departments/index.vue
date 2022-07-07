<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card v-loading="loading" class="tree-card">
        <!-- 用了一个行列布局 -->
        <tree-tools :node-data="company" :is-root="true" @add-depts="handleAddDepts" />

        <!-- 放置一个el-tree组件 -->
        <el-tree
          :data="list"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 用了一个行列布局 -->
          <template v-slot="scoped">
            <tree-tools
              :node-data="scoped.data"
              @del-depts="getDepartMents"
              @add-depts="handleAddDepts"
              @close-dialog="edit"
            />
          </template>
        </el-tree>
      </el-card>
      <!-- 新增弹出框组件 -->
      <!--
        sync的使用步骤：
          1.在属性上添加sync修饰符
          2.在子组件内部可以修改值，有特定的语法 this.$emit(update:'自定义属性名',新值)
           -->
      <!-- 我们可以通过**`ref`**调用**`add-dept.vue`**的实例方法 -->
      <add-dept
        ref="addDeptDialog"
        :show-dialog.sync="showDialog"
        :node-data="nodeData"
        :origin-data="originData"

        @add-depts="getDepartMents"
      />
    </div>
  </div>
</template>

<script>
// 导入组件对象
import treeTools from './tree-tools.vue'
// 导入
import { reqDepartMents } from '@/api/departments'
import { transListToTree } from '@/utils'
import AddDept from './components/add-dept.vue'
// 导入新增部门弹框组件

export default {
  name: 'Departments',
  components: { treeTools, AddDept },
  data() {
    return {
      list: [],
      nodeData: {},
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      company: { name: '中国有限公司', manager: '负责人' },
      // 控制dailog的变量
      showDialog: false,
      // 存一份数据
      originData: [],
      // 网络延迟loding的变量
      loading: false
    }
  },
  created() {
    this.getDepartMents()
  },
  methods: {
    // 获取公司信息
    async  getDepartMents() {
      this.loading = true
      const { data: res } = await reqDepartMents()
      // console.log(res)
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      // 调用函数 将列表数据转换为树状图
      this.list = transListToTree(res.depts, '')
      // 转化树状图之前存一份数据
      this.originData = res.depts
      this.loading = false
    },
    // 新增部门
    handleAddDepts(nodeData) {
      this.showDialog = true
      this.nodeData = nodeData
    },
    // 编辑部门
    edit(nodeData) {
      this.showDialog = true
      this.nodeData = nodeData
      // 3.获取部门的详情  父组件通过ref可以调用子组件内部的方法
      // dialog组件显示或隐藏是异步的
      this.$nextTick(() => {
        this.$refs.addDeptDialog.getDepartDetail()
      })
    }

  }
}
</script>

<style scoped lang="scss">
.tree-card {
  padding: 30px 30px;
  font-size:15px;

}
.el-tree {
  ::v-deep {
    // 小三角的样式, 去掉默认的小三角的旋转效果
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    /* // 有子节点 且未展开 + */
    .el-icon-caret-right:before {
      background: url("~@/assets/common/add-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    /* // 有子节点 且已展开 - */
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before{
      background: url("~@/assets/common/minus-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    /* // 没有子节点 */
    .el-tree-node__expand-icon.is-leaf::before  {
      background: url("~@/assets/common/user-filling.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
  }
}

</style>
