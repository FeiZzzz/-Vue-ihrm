<template>
  <div class="upload-box">
    <!-- 核心功能: 1.预览 2.数量控制 3.删除 4.上传 进度条 -->
    <!--
        action: 图片默认上传的地址 设置为空或 #
        list-type="picture-card": 照片墙
        file-list: 文件列表数据  是数组
        on-preview: 预览属性  会触发图片预览的钩子函数
        on-remove:  删除  会触发删除的钩子函数
        on-change:  文件状态改变时触发
        http-request: 覆盖默认的上传行为，可以自定义上传的实现
        before-upload: 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
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
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="showDialog" top="3vh" title="图片预览" width="500px">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 导入腾讯云的包(sdk)
const cos = new COS({
  SecretId: 'AKIDWszrUs0tXw61h8KHyPbYFhwwgBRSDnAJ', // 身份识别ID
  SecretKey: 'xf7LJ2WmmY5NXXPCvUu9HJE5oU7c2Obe' // 身份秘钥
})
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
      fileList: [{}]
    }
  },

  computed: {
    fileComputed() {
      return this.fileList.length >= this.limit
    },
    uploadAllSuccess() {
      return this.fileList.every(item => item.status === 'success')
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
      // console.log(file)
    },
    // 配置上传前的校验, 只要通过校验, 才能进行上传
    beforeUpload(file) {
      // 1. 限制文件类型 file.type
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/webp']
      if (!types.includes(file.type)) {
        this.$message.error('上传的图片格式, 必须是jpg, gif, bmp, png的格式!')
        return false
      }
      // 2. 限制文件大小 file.size
      if (file.size / 1024 / 1024 >= 5) {
        this.$message.error('上传头像过大, 超过了5M, 必须5M以内')
        return false
      }
      return true
    },
    // 自定义上传
    upload(params) {
      if (params.file) {
        // 找到对应的上传的这个file的项
        const o = this.fileList.find(item => item.uid === params.file.uid)
        // 执行上传操作
        cos.putObject({
          Bucket: 'web78-1312861742', /* 存储桶 */
          Region: 'ap-chengdu', /* 存储桶所在地域，必须字段 */
          Key: parseInt(Math.random() * 1000) + '-' + params.file.name, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: params.file, // 上传文件对象
          onProgress: (progressData) => {
            // console.log(progressData)
            // 更新图片状态
            o.status = 'uploading'
            o.percentage = parseInt(progressData.percent * 100)
          }
        }, (err, data) => {
          if (err) return

          // 上传成功后
          // 更新图片状态
          o.status = 'success'
          // 替换图片路径
          o.url = 'https://' + data.Location
        })
      }
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
