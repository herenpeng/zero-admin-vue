<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import resize from '@/components/mixins/resize'

export default {
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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      chartColor: ['#FF005A', '#3888fa', '#05ea2c'],
      chartAnimationEasing: ['cubicInOut', 'quadraticOut']
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
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
      this.setOptions(this.chartData)
    },
    setOptions(chartData) {
      this.chart.setOption({
        xAxis: {
          data: chartData.xaxis,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: { show: false }
        },
        legend: {
          data: Object.keys(chartData.data)
        },
        series: this.buildSeries(chartData.data)
      }, true)
    },
    buildSeries(chartData) {
      const series = []
      for (const key in chartData) {
        const color = this.chartColor[series.length % this.chartColor.length]
        const animationEasing = this.chartAnimationEasing[series.length % this.chartAnimationEasing.length]
        series.push({
          name: key,
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: color,
              lineStyle: {
                color: color,
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: chartData[key],
          animationDuration: 2800,
          animationEasing: animationEasing
        })
      }
      return series
    }
  }
}
</script>
