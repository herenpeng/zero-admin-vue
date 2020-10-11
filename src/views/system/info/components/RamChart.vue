<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from '@/components/mixins/resize'

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
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      chartValue: [
        { value: 0, name: '内存已使用' },
        { value: 5000, name: '内存未使用' }
      ]
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
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['内存已使用', '内存未使用']
        },
        series: [
          {
            name: '服务器内存占用情况',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.chartValue,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
      // setInterval(() => {
      //   this.chartValue[0].value = this.chartValue[0].value + 100
      //   this.initChart()
      // }, 1000)
    }
  }
}
</script>
