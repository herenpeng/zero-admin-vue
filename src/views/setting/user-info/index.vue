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
            <el-avatar :size="150" :src="userInfo.avatar" />
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-card shadow="hover" style="margin-top: 20px;">
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
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
          <span v-else>{{ userInfo.name || '点击编辑修改姓名' }}</span>
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
        <el-col :span="2">
          性别：
        </el-col>
        <el-col :span="8">
          <template v-if="edit.gender">
            <el-switch v-model="userInfo.gender" active-text="男" inactive-text="女" style="width: 300px;margin-right: 30px;padding-left: 150px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('gender')"
            >
              关闭
            </el-button>
          </template>
          <span v-else>{{ userInfo.gender | genderFilter }}</span>
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="edit.gender"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('gender')"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.gender=!edit.gender"
          >
            编辑
          </el-button>
        </el-col>
      </el-row>
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
        <el-col :span="2">
          手机号码：
        </el-col>
        <el-col :span="8">
          <template v-if="edit.mobile">
            <el-input v-model="userInfo.mobile" class="edit-input" size="medium" style="width: 300px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('mobile')"
            >
              关闭
            </el-button>
          </template>
          <span v-else>{{ userInfo.mobile || '点击编辑修改手机号码' }}</span>
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="edit.mobile"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('mobile')"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.mobile=!edit.mobile"
          >
            编辑
          </el-button>
        </el-col>
        <el-col :span="2">
          电子邮箱：
        </el-col>
        <el-col :span="8">
          <template v-if="edit.mail">
            <el-input v-model="userInfo.mail" class="edit-input" size="medium" style="width: 300px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('mail')"
            >
              关闭
            </el-button>
          </template>
          <span v-else>{{ userInfo.mail || '点击编辑修改电子邮箱' }}</span>
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="edit.mail"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="sendVerifyMail()"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.mail=!edit.mail"
          >
            编辑
          </el-button>
        </el-col>
      </el-row>
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
        <el-col :span="2">
          出生日期：
        </el-col>
        <el-col :span="8">
          <template v-if="edit.birthday">
            <el-date-picker
              v-model="userInfo.birthday"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择出生日期"
              :picker-options="pickerOptions"
              style="width: 300px;margin-right: 30px;"
            />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('birthday')"
            >
              关闭
            </el-button>
          </template>
          <span v-else>{{ userInfo.birthday || '点击编辑修改出生日期' }}</span>
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="edit.birthday"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('birthday')"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.birthday=!edit.birthday"
          >
            编辑
          </el-button>
        </el-col>
        <el-col :span="2">
          身份证号：
        </el-col>
        <el-col :span="8">
          <template v-if="edit.idNumber">
            <el-input v-model="userInfo.idNumber" class="edit-input" size="medium" style="width: 300px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('idNumber')"
            >
              关闭
            </el-button>
          </template>
          <span v-else>{{ userInfo.idNumber || '点击编辑修改身份证号' }}</span>
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="edit.idNumber"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('idNumber')"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.idNumber=!edit.idNumber"
          >
            编辑
          </el-button>
        </el-col>
      </el-row>
      <el-row style="line-height: 50px;text-align: center;width: 100%;">
        <el-col :span="2">
          QQ：
        </el-col>
        <el-col :span="8">
          <template v-if="edit.qq">
            <el-input v-model="userInfo.qq" class="edit-input" size="medium" style="width: 300px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('qq')"
            >
              关闭
            </el-button>
          </template>
          <span v-else>{{ userInfo.qq || '点击编辑修改QQ号码' }}</span>
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="edit.qq"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('qq')"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.qq=!edit.qq"
          >
            编辑
          </el-button>
        </el-col>
        <el-col :span="2">
          微信：
        </el-col>
        <el-col :span="8">
          <template v-if="edit.weChat">
            <el-input v-model="userInfo.weChat" class="edit-input" size="medium" style="width: 300px;margin-right: 30px;" />
            <el-button
              class="cancel-btn"
              size="small"
              type="warning"
              icon="el-icon-close"
              @click="cancelEdit('weChat')"
            >
              关闭
            </el-button>
          </template>
          <span v-else>{{ userInfo.weChat || '点击编辑修改微信号码' }}</span>
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="edit.weChat"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit('weChat')"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit.weChat=!edit.weChat"
          >
            编辑
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="邮件验证"
      :visible.sync="verifyMailDialogVisible"
      width="30%"
    >
      <el-input v-model="verify" class="edit-input" size="medium" placeholder="请输入邮箱验证码" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="verifyMailDialogVisible = false; cancelEdit('mail')">取 消</el-button>
        <el-button type="primary" @click="verifyMail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getInfo, updateUserInfo, uploadAvatar, sendVerifyMail, verifyMail } from '@/api/setting/user-info'
export default {
  name: 'UserInfo',
  filters: {
    genderFilter(genderValue) {
      if (genderValue === null) {
        return '点击编辑修改性别'
      }
      if (genderValue) {
        return '男'
      } else {
        return '女'
      }
    }
  },
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
    uploadAvatar() {
      this.$confirm('上传该图片作为头像, 将会覆盖原头像, 是否继续?', '提示', {
        confirmButtonText: '继续上传',
        cancelButtonText: '取消上传',
        type: 'warning'
      }).then(() => {
        uploadAvatar(this.file).then(res => {
          this.userInfo.avatar = res.data
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
      this.userInfo[key] = this.sourceUserInfo[key]
      this.edit[key] = !this.edit[key]
    },
    confirmEdit(key) {
      this.edit[key] = !this.edit[key]
      updateUserInfo(this.userInfo).then(res => {
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        this.getInfo()
      })
    },
    sendVerifyMail() {
      if (!this.userInfo.mail) {
        this.$message({
          type: 'warning',
          message: '电子邮箱不允许为空，请输入电子邮箱'
        })
        return
      }
      this.verifyMailDialogVisible = true
      sendVerifyMail(this.userInfo.mail).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '邮箱验证码邮件发送成功，请注意查收'
          })
        } else {
          this.$message({
            type: 'error',
            message: '邮箱验证码邮件发送失败，请重新发送'
          })
        }
      })
    },
    verifyMail() {
      verifyMail(this.userInfo.mail, this.verify).then(res => {
        this.verify = null
        this.verifyMailDialogVisible = false
        if (res.data) {
          this.confirmEdit('mail')
        } else {
          this.$message({
            type: 'error',
            message: '邮箱验证码错误，验证失败'
          })
          this.cancelEdit('mail')
        }
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
