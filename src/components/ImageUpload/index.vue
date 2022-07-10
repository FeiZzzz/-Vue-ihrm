<template>
  <div class="upload-box">
    <!-- 核心功能: 1.预览 2.数量控制 3.删除 4.上传 进度条 -->
    <!--
        action: 图片默认上传的地址 设置为空或 #
        list-type="picture-card": 照片墙
        file-list: 文件列表数据  是数组
        on-preview: 预览属性  会触发图片预览的钩子函数
        on-remove:  删除  会触发删除的钩子函数
     -->
    <el-upload
      :on-preview="preview"
      :file-list="fileList"
      list-type="picture-card"
      action="#"
      :limit="limit"
      :class="{disabled:fileComputed}"
      :on-remove="hanlelRemove"
      :on-change="handleChange"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="showDialog" top="3vh" title="图片预览" width="500px">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'HrsaasIndex',
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      fileList: [
        { url: 'https://img0.baidu.com/it/u=1956654045,1805502168&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=649' },
        { url: 'https://img2.baidu.com/it/u=2781774955,128111050&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=495' }
      ]
    }
  },

  computed: {
    fileComputed() {
      return this.fileList.length >= this.limit
    }
  },

  methods: {
    // 预览图片
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 删除图片
    hanlelRemove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 文件改变时的状态
    // 添加文件, 用户选了就应该新增文件预览
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      this.fileList = [...fileList]
    },
    upload(params) {
      console.log(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled {
  ::v-deep {
    .el-upload--picture-card {
      display: none
    }
  }
}
</style>
