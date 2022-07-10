<template>
  <UploadExcel :on-success="handleSuccess" />
</template>

<script>
import { reqImportEmployee } from '@/api/employees'
export default {
  name: 'Import',
  computed: {
    type() {
      return this.$route.query.type
    }
  },
  methods: {
    //  格式化日期
    formatExcelDate(numb, format) {
      const time = new Date((numb) * 24 * 3600000 + 1) // 毫秒
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },
    async  batchUser(header, results) {
      //   console.log(header, results)
    // header中, results中的数据是中文的, 但是提交给后台的要是英文的
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const obj = {}
        for (const k in item) {
          if (['timeOfEntry', 'correctionTime'].includes(userRelations[k])) {
            obj[userRelations[k]] = this.formatExcelDate(item[k])
          } else {
            obj[userRelations[k]] = item[k]
            //   console.log(userRelations[k]) // 属性名
            //   console.log(obj[userRelations[k]]) // 属性值
          }
        }
        arr.push(obj)
      })
      //   console.log(arr)
      await reqImportEmployee(arr)
      this.$message.success('批量导入成功')
      this.$router.back()
    },
    handleSuccess({ header, results }) {
      if (this.type === 'user') {
        this.batchUser(header, results)
      }
    }
  }
}
</script>

<style>

</style>
