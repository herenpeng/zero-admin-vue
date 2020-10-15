<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from '@/components/mixins/resize'
import { getMemInfo } from '@/api/system/server'

export default {
  name: 'RamChart',
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
      mem: {},
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
    this.getMemInfo()
    this.timer = setInterval(() => {
      this.getMemInfo()
    }, 3000)
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '服务器内存'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['已用内存', '剩余内存']
        },
        series: [
          {
            name: '服务器内存使用情况',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: this.mem.used, name: '已用内存' },
              { value: this.mem.free, name: '剩余内存' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    getMemInfo() {
      getMemInfo().then(res => {
        this.mem = res.data
        this.initChart()
      })
    }
  }
}
</script>
