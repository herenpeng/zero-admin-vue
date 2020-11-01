<template>
  <div class="errPage-container">
    <el-button class="pan-back-btn" @click="back">
      <i class="el-icon-arrow-left el-icon--left"></i>返回
    </el-button>
    <el-button class="pan-back-btn" @click="index">
      首页<i class="el-icon-arrow-right el-icon--right"></i>
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          403!
        </h1>
        <h2>你没有权限进行该操作或进入该页面</h2>
        <ul class="list-unstyled">
          <li>或者你可以去:</li>
          <li class="link-type">
            <router-link to="/index">
              回首页
            </router-link>
          </li>
          <li><a href="#" @click.prevent="dialogVisible=true">点我看图</a></li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" title="点我看图">
      <img :src="ewizardClap" class="pan-img">
    </el-dialog>
  </div>
</template>

<script>
import errGif from '@/assets/403_images/403.gif'

export default {
  name: 'Page403',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/index' })
      } else {
        this.$router.go(-1)
      }
    },
    index() {
      this.$router.push({ path: '/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .errPage-container {
    width: 800px;
    max-width: 100%;
    margin: 100px auto;

    .pan-back-btn {
      background: #008489;
      color: #fff;
      border: none !important;
    }

    .pan-gif {
      margin: 0 auto;
      display: block;
    }

    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }

    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }

    .list-unstyled {
      font-size: 14px;

      li {
        padding-bottom: 5px;
      }

      a {
        color: #008489;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
