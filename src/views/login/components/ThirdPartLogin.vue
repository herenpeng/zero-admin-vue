<template>
  <div class="social-signup-container">
    <div class="sign-btn" @click="wechatHandleClick('wechat')">
      <span class="wx-svg-container"><svg-icon icon-class="wechat" class="icon" /></span>
      WeChat
    </div>
    <div class="sign-btn" @click="qqHandleClick('qq')">
      <span class="qq-svg-container"><svg-icon icon-class="qq" class="icon" /></span>
      QQ
    </div>
    <div class="sign-btn" @click="githubHandleClick('github')">
      <span class="qq-svg-container"><svg-icon icon-class="github" class="icon" /></span>
      GitHub
    </div>
  </div>
</template>

<script>
import openWindow from '@/utils/open-window'

export default {
  name: 'ThirdPartLogin',
  methods: {
    wechatHandleClick(thirdpart) {
      alert('ok')
      // this.$store.commit('SET_AUTH_TYPE', thirdpart)
      // const appid = 'xxxxx'
      // const redirect_uri = encodeURIComponent('xxx/redirect?redirect=' + window.location.origin + '/auth-redirect')
      // const url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_login#wechat_redirect'
      // openWindow(url, thirdpart, 540, 540)
    },
    qqHandleClick(thirdpart) {
      alert('ok')
      // this.$store.commit('SET_AUTH_TYPE', thirdpart)
      // const client_id = 'xxxxx'
      // const redirect_uri = encodeURIComponent('xxx/redirect?redirect=' + window.location.origin + '/auth-redirect')
      // const url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirect_uri
      // openWindow(url, thirdpart, 540, 540)
    },
    githubHandleClick(thirdPart) {
      window.addEventListener('message', function(e) {
        // e.data 就是后端颁发的token
        // 执行vuex里面的方法 可以理解拿到了token 去请求获取用户信息的接口
        // this.$store.dispatch('loginByOauth', e.data)
        alert(JSON.stringify(e.data))
      }, false)
      // this.$store.commit('SET_AUTH_TYPE', thirdPart)
      const clientId = '4eeb8ec1e2e70c599f5a'
      const redirectUri = encodeURIComponent('http://127.0.0.1:10000/api/oauth/github/login')
      const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&state=STATE&redirect_uri=${redirectUri}`
      window.open(url, '_blank')
      // 监听回调方法 方法文档地址：https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
      this.show = false
    }
  },
  postMessage(message, callable) {
    window.postMessage(message, callable)
  }
}
</script>

<style lang="scss" scoped>
  .social-signup-container {
    margin: 20px 0;

    .sign-btn {
      display: inline-block;
      cursor: pointer;
    }

    .icon {
      color: #fff;
      font-size: 24px;
      margin-top: 8px;
    }

    .wx-svg-container,
    .qq-svg-container {
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      padding-top: 1px;
      border-radius: 4px;
      margin-bottom: 20px;
      margin-right: 5px;
    }

    .wx-svg-container {
      background-color: #24da70;
    }

    .qq-svg-container {
      background-color: #6BA2D6;
      margin-left: 50px;
    }
  }
</style>
