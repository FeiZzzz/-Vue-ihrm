<template>
  <div>
    <!-- 工作日历, 年和月 -->
    <div class="select-box">
      <el-select v-model="currentYear" size="small" style="width: 120px; margin-right: 10px" @change="change">
        <!-- 年份取给定年份的, 前五年 + 后五年 -->
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;" @change="change">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <!-- 日历 -->
    <el-calendar v-model="currentDate">
      <template #dateCell="{date,data}">
        <div class="date-content">
          <span class="text">{{ getDay(data.day) }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>

  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  props: {
    // 父向子传值，如果是引用类型，设置默认值时，值要写成函数 函数的返回值为默认对象
    startDate: {
      type: Date,
      default: () => {
        return new Date()
      }
    }
  },
  data() {
    return {
      currentYear: null, // 当前年份
      currentMonth: null, // 当前月份
      //   yearList: [] // 要遍历的年的数组
      currentDate: ''
    }
  },
  computed: {
    yearList() {
      // 方式一：
    //   const arr = []
    //   for (let i = this.currentYear - 5; i <= this.currentYear + 5; i++) {
    //     arr.push(i)
    //   }
    //   return arr

      // 方式二：
      return Array.from(new Array(11), (item, index) => index - 5 + this.currentYear) // 2017-2027
    }
  },
  // 侦听时间对象的变化
  watch: {
    currentDate(newval) {
      this.currentYear = newval.getFullYear()
      this.currentMonth = newval.getMonth() + 1
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1
    this.change()
  },
  methods: {
    // 年月日同步到下拉列表
    change() {
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
    },
    // 将日期
    getDay(day) {
      // 截取 2022-07-16 ===> ['2022','07','01']
      const str = day.split('-')[2] // '01'
      return str.startsWith('0') ? str.substr(1) : str
    },
    // 筛选周六周日
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }

}
</script>

<style lang="scss" scoped>
.select-box {
  display: flex;
  justify-content: flex-end;
}
td.prev{
  border: none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 16px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
</style>
