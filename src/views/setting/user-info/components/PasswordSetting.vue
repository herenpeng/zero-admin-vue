<template>
  <el-card shadow="hover">
    <div slot="header">
      <span>{{ $t('table.setting.userInfo.passwordSetting') }}</span>
    </div>
    <el-row>
      <el-col :span="12">
        <el-form ref="settingForm" :model="settingForm" status-icon :rules="rules" label-width="140px"
                 class="demo-ruleForm" style="width: 400px"
        >
          <el-form-item :label="$t('table.setting.userInfo.oldPassword')" prop="oldPassword">
            <el-input v-model="settingForm.oldPassword" />
          </el-form-item>
          <el-form-item :label="$t('table.setting.userInfo.newPassword')" prop="newPassword">
            <el-input v-model="settingForm.newPassword" type="password" autocomplete="new-password" :show-password="true" />
          </el-form-item>
          <el-form-item :label="$t('table.setting.userInfo.confirmPassword')" prop="checkPassword">
            <el-input v-model="settingForm.checkPassword" type="password" autocomplete="new-password" :show-password="true" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">{{ $t('table.submit') }}</el-button>
            <el-button @click="resetForm()">{{ $t('table.resetting') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div class="banner">
          <el-progress type="dashboard" :percentage="percentage" :color="colors" />
          <div>{{ $t('table.setting.userInfo.passwordStrength') }}</div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { checkPassword, resetPassword } from '@/api/setting/password'

export default {
  name: 'PasswordSetting',
  data() {
    const checkOldPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('table.setting.userInfo.passwordEmptyTip')))
      } else {
        this.checkPassword(value).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error(this.$t('table.setting.userInfo.passwordErrorTip')))
          }
        })
      }
    }
    const validateNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('table.setting.userInfo.newPasswordTip')))
      } else {
        if (value.length < 6) {
          callback(new Error(this.$t('table.setting.userInfo.passwordLengthTip')))
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
        callback(new Error(this.$t('table.setting.userInfo.passwordStrengthTip')))
      } else {
        callback()
      }
    }
    const validateCheckPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('table.setting.userInfo.newPasswordTip2')))
      } else if (value !== this.settingForm.newPassword) {
        callback(new Error(this.$t('table.setting.userInfo.passwordDifferentTip')))
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
    '$i18n.locale'(newValue, oldValue) {
      this.$refs['settingForm'].clearValidate()
    },
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
              title: this.$t('common.success'),
              message: this.$t(res.message),
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
  }
}
</script>
<style scoped>
.banner {
  display:block;
  position:relative;
  text-align: center;
}
</style>
