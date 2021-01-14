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
            fit="scale-down"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handlerChange"
            :on-exceed="handleExceed"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-button style="margin-top: 10px;" type="primary" @click="uploadAvatar">点击上传</el-button>
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

    <el-card shadow="hover" style="margin-top: 20px;">
      <el-row style="line-height: 50px;text-align: center;">
        <el-col :span="2">
          姓名：
        </el-col>
        <el-col :span="8">
          <template v-if="edit.name">
            <el-input v-model="userInfo.name" class="edit-input" size="medium" style="width: 300px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('name')"
            >
              关闭
            </el-button>
          </template>
          <span v-else>{{ userInfo.name }}</span>
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="edit.name"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('name')"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.name=!edit.name"
          >
            编辑
          </el-button>
        </el-col>
        <el-col :span="3">
          性别：
        </el-col>
        <el-col :span="9" />
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { getAvatar, uploadAvatar } from '@/api/setting/user-info'
export default {
  name: 'UserInfo',
  data() {
    return {
      file: null,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      avatar: '',
      userInfo: {
        name: '何任鹏',
        gender: '男'
      },
      edit: {
        name: false,
        gender: false
      }
    }
  },
  created() {
    this.getAvatar()
  },
  methods: {
    getAvatar() {
      getAvatar().then(res => {
        this.avatar = res.data
      })
    },
    uploadAvatar() {
      this.$confirm('上传该图片作为头像, 将会覆盖原头像, 是否继续?', '提示', {
        confirmButtonText: '继续上传',
        cancelButtonText: '取消上传',
        type: 'warning'
      }).then(() => {
        uploadAvatar(this.file).then(res => {
          this.avatar = res.data
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上传'
        })
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
    },
    cancelEdit(key) {
      this.edit[key] = !this.edit[key]
    },
    confirmEdit(key) {
      this.edit[key] = !this.edit[key]
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
