<template>
  <div class="app-container">
    <el-card shadow="hover">
      <div slot="header">
        <span>上传头像</span>
      </div>
      <el-row>
        <el-col :span="12">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handlerChange"
            :on-exceed="handleExceed"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-button style="margin-top: 10px;" type="primary" @click="uploadImage">点击上传</el-button>
        </el-col>
        <el-col :span="12" style="text-align: center">
          <div class="banner">
            <el-avatar :size="150" :src="avatar" />
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { uploadImage } from '@/api/setting/user-info'
export default {
  name: 'UserInfo',
  data() {
    return {
      file: null,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      avatar: 'http://127.0.0.1:10000/api/image/1819b431-42d1-44c8-9e27-e074cd8a3b93.jpg'
    }
  },
  methods: {
    uploadImage() {
      uploadImage(this.file).then(res => {
        console.log(res.data)
      })
    },
    handlerChange(file, fileList) {
      this.file = file.raw
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file) {
      this.file = null
    },
    handleExceed(files, fileList) {
      this.$message({
        type: 'info',
        message: '只允许上传一张图片作为头像'
      })
    }
  }
}
</script>
<style scoped>
  .banner {
    display:block;
    position:relative;
    margin:auto;
  }
</style>
