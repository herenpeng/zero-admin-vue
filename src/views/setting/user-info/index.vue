<template>
  <div class="app-container">

    <el-row :gutter="20">
      <!--上传头像-->
      <el-col :span="12">
        <upload-avatar :avatar="userInfo.avatar" @upload-avatar="avatar => {userInfo.avatar = avatar}" />
      </el-col>
      <!--密码设置-->
      <el-col :span="12">
        <password-setting />
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <!--用户信息-->
    <el-card shadow="hover" style="margin-top: 20px;">
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
        <el-col :span="12">
          <user-info-input :name="$t('table.setting.userInfo.name')"
                           :value="userInfo.name"
                           :edit-state="edit.name"
                           :edit-tip="$t('table.setting.userInfo.nameEdit')"
                           @edit="edit.name=!edit.name"
                           @cancel="edit.name=!edit.name"
                           @confirm="data => confirmEdit('name', data)"
          />
        </el-col>
        <el-col :span="12">
          <user-info-switch :name="$t('table.setting.userInfo.gender')"
                            :value="userInfo.gender"
                            :active-text="$t('common.male')"
                            :inactive-text="$t('common.female')"
                            :edit-state="edit.gender"
                            :edit-tip="$t('table.setting.userInfo.nameEdit')"
                            @edit="edit.gender=!edit.gender"
                            @cancel="edit.gender=!edit.gender"
                            @confirm="data => confirmEdit('gender', data)"
          />
        </el-col>
      </el-row>
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
        <el-col :span="12">
          <user-info-input :name="$t('table.setting.userInfo.mobile')"
                           :value="userInfo.mobile"
                           :edit-state="edit.mobile"
                           :edit-tip="$t('table.setting.userInfo.mobileEdit')"
                           @edit="edit.mobile=!edit.mobile"
                           @cancel="edit.mobile=!edit.mobile"
                           @confirm="data => confirmEdit('mobile', data)"
          />
        </el-col>
        <el-col :span="12">
          <user-info-input :name="$t('table.setting.userInfo.mail')"
                           :value="userInfo.mail"
                           :edit-state="edit.mail"
                           :edit-tip="$t('table.setting.userInfo.mailEdit')"
                           @edit="edit.mail=!edit.mail"
                           @cancel="edit.mail=!edit.mail"
                           @confirm="data => sendVerifyMail(data)"
          />
        </el-col>
      </el-row>
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
        <el-col :span="12">
          <user-info-picker :name="$t('table.setting.userInfo.birthday')"
                            :value="userInfo.birthday"
                            :edit-state="edit.birthday"
                            :edit-tip="$t('table.setting.userInfo.birthdayEdit')"
                            @edit="edit.birthday=!edit.birthday"
                            @cancel="edit.birthday=!edit.birthday"
                            @confirm="data => confirmEdit('birthday', data)"
          />
        </el-col>
        <el-col :span="12">
          <user-info-input :name="$t('table.setting.userInfo.idNumber')"
                           :value="userInfo.idNumber"
                           :edit-state="edit.idNumber"
                           :edit-tip="$t('table.setting.userInfo.idNumberEdit')"
                           @edit="edit.idNumber=!edit.idNumber"
                           @cancel="edit.idNumber=!edit.idNumber"
                           @confirm="data => confirmEdit('idNumber', data)"
          />
        </el-col>
      </el-row>
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
        <el-col :span="12">
          <user-info-input :name="$t('table.setting.userInfo.qq')"
                           :value="userInfo.qq"
                           :edit-state="edit.qq"
                           :edit-tip="$t('table.setting.userInfo.qqEdit')"
                           @edit="edit.qq=!edit.qq"
                           @cancel="edit.qq=!edit.qq"
                           @confirm="data => confirmEdit('qq', data)"
          />
        </el-col>
        <el-col :span="12">
          <user-info-input :name="$t('table.setting.userInfo.weChat')"
                           :value="userInfo.weChat"
                           :edit-state="edit.weChat"
                           :edit-tip="$t('table.setting.userInfo.weChatEdit')"
                           @edit="edit.weChat=!edit.weChat"
                           @cancel="edit.weChat=!edit.weChat"
                           @confirm="data => confirmEdit('weChat', data)"
          />
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      :title="$t('table.setting.userInfo.mailVerify')"
      :visible.sync="verifyMailDialogVisible"
      width="30%"
    >
      <el-input v-model="verify" class="edit-input" size="medium" :placeholder="$t('table.setting.userInfo.mailVerifyPlaceholder')" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelVerify()">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="verifyMail">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUserInfo, updateUserInfo, sendVerifyMail, verifyMail } from '@/api/setting/user-info'
import PasswordSetting from './components/PasswordSetting'
import UploadAvatar from './components/UploadAvatar'
import UserInfoInput from './components/UserInfoInput'
import UserInfoSwitch from './components/UserInfoSwitch'
import UserInfoPicker from './components/UserInfoPicker'

export default {
  name: 'UserInfo',
  components: { PasswordSetting, UploadAvatar, UserInfoInput, UserInfoSwitch, UserInfoPicker },
  data() {
    return {
      file: null,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      userInfo: {},
      edit: {
        name: false,
        gender: false,
        mobile: false,
        mail: false,
        qq: false,
        weChat: false,
        birthday: false,
        idNumber: false
      },
      mail: '',
      verifyMailDialogVisible: false,
      verify: null
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      getUserInfo().then(res => {
        this.userInfo = res.data
      })
    },
    updateSuccess(message) {
      this.$notify({
        title: this.$t('common.success'),
        message: this.$t(message),
        type: 'success',
        duration: 2000
      })
    },
    confirmEdit(key, data) {
      if (this.userInfo[key] === data) {
        this.edit[key] = !this.edit[key]
        return
      }
      this.edit[key] = !this.edit[key]
      this.userInfo[key] = data
      updateUserInfo(this.userInfo).then(res => {
        this.updateSuccess(res.message)
      })
    },
    sendVerifyMail(data) {
      if (!data) {
        this.$message({
          type: 'warning',
          message: this.$t('table.setting.userInfo.mailVerifyTip')
        })
        return
      }
      if (this.userInfo.mail === data) {
        this.edit.mail = !this.edit.mail
        return
      }
      this.mail = this.userInfo.mail
      this.userInfo.mail = data
      this.verifyMailDialogVisible = true
      sendVerifyMail(this.userInfo.mail).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: this.$t('table.setting.userInfo.mailSendSuccessTip')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('table.setting.userInfo.mailSendFailTip')
          })
        }
      })
    },
    cancelVerify() {
      this.verifyMailDialogVisible = false
      this.userInfo.mail = this.mail
      this.edit.mail = !this.edit.mail
    },
    verifyMail() {
      verifyMail(this.userInfo.mail, this.verify).then(res => {
        this.verify = null
        this.verifyMailDialogVisible = false
        this.edit.mail = !this.edit.mail
        if (res.data) {
          this.updateSuccess(res.message)
        } else {
          this.userInfo.mail = this.mail
          this.$message({
            type: 'error',
            message: this.$t('table.setting.userInfo.mailVerifyErrorTip')
          })
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
