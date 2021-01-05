<template>
  <div class="app-container">
    <el-card shadow="hover">
      <div slot="header">
        <span>上传头像</span>
      </div>
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        :on-success="handlerSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"/>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-card>
  </div>

</template>
<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  methods: {
    handlerSuccess(response, file, fileList) {
      console.log(file)
      console.log(fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file) {
      console.log(file)
    }
  }
}
</script>
