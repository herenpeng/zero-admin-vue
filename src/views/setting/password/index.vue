<template>
  <div class="app-container">
    <el-card shadow="hover">
      <el-row>
        <el-col :span="12">
          <el-form ref="settingForm" :model="settingForm" status-icon :rules="rules" label-width="100px"
                   class="demo-ruleForm"
          >
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="settingForm.oldPassword" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="settingForm.newPassword" type="password" autocomplete="new-password" :show-password="true" />
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
              <el-input v-model="settingForm.checkPassword" type="password" autocomplete="new-password" :show-password="true" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm()">提交</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" style="text-align: center">
          <el-progress type="dashboard" :percentage="percentage" :color="colors" />
          <div>新密码强度</div>
        </el-col>
      </el-row>
    </el-card>
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
        if (value.length < 6) {
          callback(new Error('密码长度不能小于6位数'))
        }
        if (this.settingForm.checkPassword !== '') {
          this.$refs.settingForm.validateField('checkPassword')
        }
        callback()
      }
    }
    const validatePasswordStrength = (rule, value, callback) => {
      this.percentage = value.length
      const numberRegex = /\d+/
      const letterRegex = /[a-zA-Z]+/
      const specialCharactersRegex = /\W+/
      if (numberRegex.test(value)) {
        this.percentage += 10
      }
      if (letterRegex.test(value)) {
        this.percentage += 20
      }
      if (specialCharactersRegex.test(value)) {
        this.percentage += 30
      }
      if (this.percentage < 30) {
        callback(new Error('新密码强度不足'))
      } else {
        callback()
      }
    }
    const validateCheckPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.settingForm.newPassword) {
        callback(new Error('两次输入的新密码不一致!'))
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
        newPassword: [
          { validator: validateNewPassword, trigger: 'blur' },
          { validator: validatePasswordStrength, trigger: 'change' }
        ],
        checkPassword: [{ validator: validateCheckPassword, trigger: 'blur' }]
      },
      percentage: 0,
      colors: [
        { color: '#fa0000', percentage: 20 },
        { color: '#ff7700', percentage: 40 },
        { color: '#fcf700', percentage: 60 },
        { color: '#007dfc', percentage: 80 },
        { color: '#09ff00', percentage: 100 }
      ]
    }
  },
  watch: {
    // newValue为新值,oldValue为旧值;
    percentage(newValue, oldValue) {
      if (newValue < 0) {
        this.percentage = 0
      }
      if (newValue > 100) {
        this.percentage = 100
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
            setTimeout(() => {
              this.logout()
            }, 2000)
          })
        }
      })
    },
    checkPassword(value) {
      return checkPassword(value)
    },
    resetForm() {
      this.$refs['settingForm'].resetFields()
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
