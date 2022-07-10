
<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <PageTools>
        <template #left>
          <span>总记录数: {{ total }} 条</span>
        </template>

        <template #right>
          <el-button type="warning" size="small" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button type="danger" size="small" @click="handleDownload">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 员工table -->
      <el-card style="margin-top: 10px;">
        <el-table v-loading="loading" border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="手机号" sortable="" prop="mobile" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="{row}">
              {{ formatDate(row.timeOfEntry) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div style="height: 60px; margin-top: 10px">
          <el-pagination
            :total="total"
            :current-page="page"
            :page-size="size"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
    <!-- 新增弹框的Dailong -->
    <add-employee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { reqGetEmployeeList, reqDelEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import dayjs from 'dayjs'
import AddEmployee from './components/add-employee.vue'

export default {
  name: 'Employees',
  components: {
    AddEmployee
  },

  data() {
    return {
      list: [],
      page: 1, // 当前页
      size: 10, // 每页条数
      total: 0, // 总条数
      loading: false, // 控制loading显示与隐藏
      showDialog: false// 控制dialog显示隐藏
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async  getEmployeeList() {
      const { data } = await reqGetEmployeeList(this.page, this.size)
      this.total = data.total
      this.list = data.rows
    },
    // 分页
    handleCurrentChange(newPage) {
      this.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === parseInt(cellValue))
      return obj ? obj.value : '未知'
    },
    formatDate(time) {
      return dayjs(time).format('YYYY年MM月DD日')
    },
    // 删除员工
    delEmployee(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await reqDelEmployee(id)
        this.$message.success('删除成功')
        // 删除成功后如果当前页没有数据并且页码值>1 就让页码值 -1
        if (this.list.length === 1 && this.page > 1) this.page--
        // 重新渲染数据
        this.getEmployeeList()
      })
    },
    // excel导出功能
    handleDownload() {
      import('@/vendor/Export2Excel').then(async excel => {
        const headersArr = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
        const headersRelations = {
          '姓名': 'username',
          '手机号': 'mobile',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        // 请注意: 如果导出的是当前页, 那么数据, this.list 即可,
        // 但是我们一般导出的是全部的数据, 需要请求到所有的数据
        // 获取所有的员工数据信息
        const { data: { rows }} = await reqGetEmployeeList(1, this.total)
        // console.log(rows)
        // 已有数据：[{id: '604f', mobile: '138088', username: '管理员', password: 'e10e'}...{}] 16个对象
        //   想要的数据 ： [[id: '604f', mobile: '138088',],...[]] 16个数组

        const arr = [] // 外层的[]

        rows.forEach(item => {
          const newArr = [] // 每一个[]
          headersArr.forEach(v => {
            const key = headersRelations[v]
            // console.log(key)
            if (key === 'formOfEmployment') {
              // item[key] === 1 ==>正式
              const obj = EmployeeEnum.hireType.find(value => value.id === +item[key])
              const res = obj ? obj.value : '未知'
              newArr.push(res)
              // console.log(res)
            } else {
              newArr.push(item[key])
            }
          })
          arr.push(newArr)
        })
        // console.log(arr)

        // console.log(excel)
        // header:表头
        // data:数据
        // filename:导出的文件名称
        // autoWidth:自动适配宽度
        // bookType:文件的扩展名

        // merges的顺序是没关系的，只要配置这两个属性，就可以导出复杂表头的excel了
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] // 需要合并的部分
        const merges = ['A1:A2', 'B1:F1', 'G1:G2'] // 需要合并的部分
        excel.export_json_to_excel({
          multiHeader, // 需要合并的部分
          merges, // 需要合并的部分
          header: headersArr, // 导出数据的表头
          data: arr, // 导出的具体数据
          filename: '员工信息表', // 导出文件名
          autoWidth: true, // 单元格是否要自适应宽度
          bookType: 'xlsx' // 导出文件类型
        })
      })
    }
  }
}
</script>

<style>

</style>
