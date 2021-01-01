<template>
  <div class="app-container">
    <el-form ref="settingForm" :model="settingForm" status-icon :rules="rules" label-width="100px"
             class="demo-ruleForm"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="settingForm.oldPassword" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="settingForm.newPassword" type="password" autocomplete="new-password" show-password="true" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="settingForm.checkPassword" type="password" autocomplete="new-password" show-password="true" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { checkPassword, resetPassword } from '@/api/setting/password'

export default {
  name: 'Password',
  data() {
    const checkOldPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      } else {
        this.checkPassword(value).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('密码输入错误'))
          }
        })
      }
    }
    const validateNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else {
        if (this.settingForm.checkPassword !== '') {
          this.$refs.settingForm.validateField('checkPassword')
        }
        callback()
      }
    }
    const validateCheckPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.settingForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      settingForm: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      rules: {
        oldPassword: [{ validator: checkOldPassword, trigger: 'blur' }],
        newPassword: [{ validator: validateNewPassword, trigger: 'blur' }],
        checkPassword: [{ validator: validateCheckPassword, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['settingForm'].validate((valid) => {
        if (valid) {
          resetPassword(this.settingForm.oldPassword, this.settingForm.newPassword).then((res) => {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    checkPassword(value) {
      return checkPassword(value)
    },
    resetForm() {
      this.$refs['settingForm'].resetFields()
    }
  }
}
</script>
