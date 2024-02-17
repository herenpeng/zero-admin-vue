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
        <el-col :span="2">
          {{ $t('table.setting.userInfo.name') }}：
        </el-col>
        <el-col :span="7">
          <template v-if="edit.name">
            <el-input v-model="userInfo.name" class="edit-input" size="medium" style="width: 280px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('name')"
            >
              {{ $t('table.close') }}
            </el-button>
          </template>
          <span v-else>{{ userInfo.name || $t('table.setting.userInfo.nameEdit') }}</span>
        </el-col>
        <el-col :span="3">
          <el-button
            v-if="edit.name"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('name')"
          >
            {{ $t('table.save') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.name=!edit.name"
          >
            {{ $t('table.edit') }}
          </el-button>
        </el-col>
        <el-col :span="2">
          {{ $t('table.setting.userInfo.gender') }}：
        </el-col>
        <el-col :span="7">
          <template v-if="edit.gender">
            <el-switch v-model="userInfo.gender" :active-text="$t('common.male')" :inactive-text="$t('common.female')" style="width: 280px;margin-right: 30px;padding-left: 150px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('gender')"
            >
              {{ $t('table.close') }}
            </el-button>
          </template>
          <span v-else>{{ userInfo.gender === null ? $t('table.setting.userInfo.genderEdit') : (userInfo.gender ? $t('common.male') : $t('common.female')) }}</span>
        </el-col>
        <el-col :span="3">
          <el-button
            v-if="edit.gender"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('gender')"
          >
            {{ $t('table.save') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.gender=!edit.gender"
          >
            {{ $t('table.edit') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
        <el-col :span="2">
          {{ $t('table.setting.userInfo.mobile') }}：
        </el-col>
        <el-col :span="7">
          <template v-if="edit.mobile">
            <el-input v-model="userInfo.mobile" class="edit-input" size="medium" style="width: 280px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('mobile')"
            >
              {{ $t('table.close') }}
            </el-button>
          </template>
          <span v-else>{{ userInfo.mobile || $t('table.setting.userInfo.mobileEdit') }}</span>
        </el-col>
        <el-col :span="3">
          <el-button
            v-if="edit.mobile"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('mobile')"
          >
            {{ $t('table.save') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.mobile=!edit.mobile"
          >
            {{ $t('table.edit') }}
          </el-button>
        </el-col>
        <el-col :span="2">
          {{ $t('table.setting.userInfo.mail') }}：
        </el-col>
        <el-col :span="7">
          <template v-if="edit.mail">
            <el-input v-model="userInfo.mail" class="edit-input" size="medium" style="width: 280px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('mail')"
            >
              {{ $t('table.close') }}
            </el-button>
          </template>
          <span v-else>{{ userInfo.mail || $t('table.setting.userInfo.mailEdit') }}</span>
        </el-col>
        <el-col :span="3">
          <el-button
            v-if="edit.mail"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="sendVerifyMail()"
          >
            {{ $t('table.save') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.mail=!edit.mail"
          >
            {{ $t('table.edit') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
        <el-col :span="2">
          {{ $t('table.setting.userInfo.birthday') }}：
        </el-col>
        <el-col :span="7">
          <template v-if="edit.birthday">
            <el-date-picker
              v-model="userInfo.birthday"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择出生日期"
              :picker-options="pickerOptions"
              style="width: 280px;margin-right: 30px;"
            />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('birthday')"
            >
              {{ $t('table.close') }}
            </el-button>
          </template>
          <span v-else>{{ userInfo.birthday || $t('table.setting.userInfo.birthdayEdit') }}</span>
        </el-col>
        <el-col :span="3">
          <el-button
            v-if="edit.birthday"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('birthday')"
          >
            {{ $t('table.save') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.birthday=!edit.birthday"
          >
            {{ $t('table.edit') }}
          </el-button>
        </el-col>
        <el-col :span="2">
          {{ $t('table.setting.userInfo.idNumber') }}：
        </el-col>
        <el-col :span="7">
          <template v-if="edit.idNumber">
            <el-input v-model="userInfo.idNumber" class="edit-input" size="medium" style="width: 280px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('idNumber')"
            >
              {{ $t('table.close') }}
            </el-button>
          </template>
          <span v-else>{{ userInfo.idNumber || $t('table.setting.userInfo.idNumberEdit') }}</span>
        </el-col>
        <el-col :span="3">
          <el-button
            v-if="edit.idNumber"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('idNumber')"
          >
            {{ $t('table.save') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.idNumber=!edit.idNumber"
          >
            {{ $t('table.edit') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
        <el-col :span="2">
          {{ $t('table.setting.userInfo.qq') }}：
        </el-col>
        <el-col :span="7">
          <template v-if="edit.qq">
            <el-input v-model="userInfo.qq" class="edit-input" size="medium" style="width: 280px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('qq')"
            >
              {{ $t('table.close') }}
            </el-button>
          </template>
          <span v-else>{{ userInfo.qq || $t('table.setting.userInfo.qqEdit') }}</span>
        </el-col>
        <el-col :span="3">
          <el-button
            v-if="edit.qq"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('qq')"
          >
            {{ $t('table.save') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.qq=!edit.qq"
          >
            {{ $t('table.edit') }}
          </el-button>
        </el-col>
        <el-col :span="2">
          {{ $t('table.setting.userInfo.weChat') }}：
        </el-col>
        <el-col :span="7">
          <template v-if="edit.weChat">
            <el-input v-model="userInfo.weChat" class="edit-input" size="medium" style="width: 280px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('weChat')"
            >
              {{ $t('table.close') }}
            </el-button>
          </template>
          <span v-else>{{ userInfo.weChat || $t('table.setting.userInfo.weChatEdit') }}</span>
        </el-col>
        <el-col :span="3">
          <el-button
            v-if="edit.weChat"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('weChat')"
          >
            {{ $t('table.save') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.weChat=!edit.weChat"
          >
            {{ $t('table.edit') }}
          </el-button>
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
        <el-button @click="verifyMailDialogVisible = false; cancelEdit('mail')">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="verifyMail">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getInfo, updateUserInfo, sendVerifyMail, verifyMail } from '@/api/setting/user-info'
import PasswordSetting from './components/PasswordSetting'
import UploadAvatar from './components/UploadAvatar'

export default {
  name: 'UserInfo',
  components: { PasswordSetting, UploadAvatar },
  data() {
    return {
      file: null,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      userInfo: {},
      sourceUserInfo: {},
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
      pickerOptions: {
        disabledDate(time) {
          // 如果没有后面的-8.64e6就是不可以选择今天的
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      verifyMailDialogVisible: false,
      verify: null
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getInfo().then(res => {
        this.sourceUserInfo = Object.assign({}, res.data)
        this.userInfo = res.data
      })
    },
    updateSuccess(message) {
      this.$notify({
        title: this.$t('common.success'),
        message: message,
        type: 'success',
        duration: 2000
      })
      this.getInfo()
    },
    cancelEdit(key) {
      this.userInfo[key] = this.sourceUserInfo[key]
      this.edit[key] = !this.edit[key]
    },
    confirmEdit(key) {
      if (this.userInfo[key] === this.sourceUserInfo[key]) {
        this.cancelEdit(key)
        return
      }
      this.edit[key] = !this.edit[key]
      updateUserInfo(this.userInfo).then(res => {
        this.updateSuccess(res.message)
      })
    },
    sendVerifyMail() {
      if (!this.userInfo.mail) {
        this.$message({
          type: 'warning',
          message: this.$t('table.setting.userInfo.mailVerifyTip')
        })
        return
      }
      if (this.userInfo.mail === this.sourceUserInfo.mail) {
        this.cancelEdit('mail')
        return
      }
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
    verifyMail() {
      verifyMail(this.userInfo.mail, this.verify).then(res => {
        this.verify = null
        this.verifyMailDialogVisible = false
        if (res.data) {
          this.edit['mail'] = !this.edit['mail']
          this.updateSuccess(res.message)
          // this.confirmEdit('mail')
        } else {
          this.$message({
            type: 'error',
            message: this.$t('table.setting.userInfo.mailVerifyErrorTip')
          })
          this.cancelEdit('mail')
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
