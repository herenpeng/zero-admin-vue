<template>
  <el-card shadow="hover">
    <div slot="header">
      <span>{{ $t('table.setting.userInfo.uploadAvatar') }}</span>
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
        <el-button style="margin-top: 54px;" type="primary" @click="uploadAvatar">{{ $t('table.upload') }}</el-button>
      </el-col>
      <el-col :span="12">
        <div class="banner">
          <el-avatar :size="150" :src="avatar" />
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { uploadAvatar } from '@/api/setting/user-info'
import store from '@/store'

export default {
  name: 'UploadAvatar',
  props: {
    avatar: {
      type: String,
      default: null
    }
  },
  methods: {
    uploadAvatar() {
      if (this.file === null) {
        this.$message({
          type: 'info',
          message: this.$t('table.setting.userInfo.uploadAvatarTip')
        })
        return
      }
      this.$confirm(this.$t('table.setting.userInfo.uploadAvatarConfirmTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('table.setting.userInfo.uploadAvatarConfirm'),
        cancelButtonText: this.$t('table.setting.userInfo.uploadAvatarCancel'),
        type: 'warning'
      }).then(() => {
        uploadAvatar(this.file).then(async(res) => {
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('table.setting.userInfo.uploadAvatarSuccess'),
            type: 'success',
            duration: 2000
          })
          await store.dispatch('user/resetAvatar', res.data)
          this.$emit('upload-avatar', res.data)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('table.setting.userInfo.cancelUploadAvatar')
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
        message: this.$t('table.setting.userInfo.uploadAvatarTip2')
      })
    }
  }
}
</script>
