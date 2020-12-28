<template>
  <div class="app-container">
    <el-form ref="settingForm" :model="settingForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model.number="settingForm.oldPassword" />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="settingForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="settingForm.checkPassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('settingForm')">提交</el-button>
        <el-button @click="resetForm('settingForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    const checkOldPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.settingForm.checkPassword !== '') {
          this.$refs.ruleForm.validateField('checkPassword')
        }
        callback()
      }
    }
    const validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.settingForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      settingForm: {
        oldPassword: '',
        password: '',
        checkPassword: ''
      },
      rules: {
        oldPassword: [{ validator: checkOldPassword, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        checkPassword: [{ validator: validateCheckPassword, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
