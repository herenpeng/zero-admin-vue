<template>
  <div class="app-container">
    <i class="el-icon-sunny" @click="drawer = true" />
    <el-drawer
      title="天气预报"
      :visible.sync="drawer"
      :with-header="false"
      :before-close="handleClose"
    >
      <el-card class="box-card info">
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="12"><div class="grid-content bg-purple">城市：{{ weather.city }}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">当前温度：{{ weather.wendu }} 摄氏度</div></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24"><div class="grid-content bg-purple">{{ weather.ganmao }}</div></el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="12"><div class="grid-content bg-purple">日期：{{ weather.yesterday.date }}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">天气：{{ weather.yesterday.type }}</div></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12"><div class="grid-content bg-purple">最低气温：{{ weather.yesterday.low }}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">最高气温：{{ weather.yesterday.high }}</div></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12"><div class="grid-content bg-purple">风向：{{ weather.yesterday.fx }}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">风力：{{ weather.yesterday.fl | fengliFilter }}</div></el-col>
          </el-row>
        </div>
      </el-card>
      <el-card v-for="(forecast,index) in weather.forecast" :key="index" class="box-card" :class="{today: index === 0}">
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="12"><div class="grid-content bg-purple">日期：{{ forecast.date }}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">天气：{{ forecast.type }}</div></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12"><div class="grid-content bg-purple">最低气温：{{ forecast.low }}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">最高气温：{{ forecast.high }}</div></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12"><div class="grid-content bg-purple">风向：{{ forecast.fengxiang }}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">风力：{{ forecast.fengli | fengliFilter }}</div></el-col>
          </el-row>
        </div>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { getWeather } from '@/api/index'

export default {
  name: 'Weather',
  filters: {
    fengliFilter(fengliValue) {
      if (fengliValue === null) {
        return null
      }
      // <![CDATA[2级]]>
      return fengliValue.replace('<![CDATA[', '').replace(']]>', '')
    }
  },
  data() {
    return {
      drawer: false,
      weather: {
        yesterday: {
          date: null,
          high: null,
          fx: null,
          low: null,
          fl: null,
          type: null
        },
        city: null,
        wendu: null,
        ganmao: null,
        forecast: [
          {
            date: null,
            high: null,
            fengli: null,
            low: null,
            fengxiang: null,
            type: null
          }
        ]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getWeather().then(res => {
        this.weather = res.data
      })
    },
    handleClose(done) {
      done()
    }
  }
}
</script>

<style>
  .el-drawer__body {
    overflow: auto;
  }
</style>
<style scoped>
  .text {
    font-size: 14px;
  }
  .item {
    padding: 0px 0px;
  }
  .box-card {
    margin: 10px auto;
    width: 420px;
    line-height: 30px;
  }
  .info {
    box-shadow: 0 2px 4px rgb(255, 0, 0), 0 0 6px rgba(255, 0, 251, 0.99);
  }
  .today {
    box-shadow: 0 2px 4px rgb(252, 237, 1), 0 0 6px rgba(255, 0, 0, 0.99);
  }
</style>
