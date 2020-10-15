<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from '@/components/mixins/resize'
import { getCpuInfo } from '@/api/system/server'

export default {
  name: 'CpuChart',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '320px'
    }
  },
  data() {
    return {
      chart: null,
      cpu: {},
      timer: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    clearInterval(this.timer)
    this.timer = null
  },
  created() {
    this.getCpuInfo()
    this.timer = setInterval(() => {
      this.getCpuInfo()
    }, 3000)
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '服务器CPU'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['用户使用率', '系统使用率']
        },
        series: [
          {
            name: '服务器CPU使用情况',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: this.cpu.used, name: '用户使用率' },
              { value: this.cpu.sys, name: '系统使用率' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    getCpuInfo() {
      getCpuInfo().then(res => {
        this.cpu = res.data
        this.initChart()
      })
    }
  }
}
</script>
