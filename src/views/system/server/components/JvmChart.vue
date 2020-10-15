<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from '@/components/mixins/resize'
import { getJvmInfo } from '@/api/system/server'

export default {
  name: 'JvmChart',
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
      jvm: {},
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
    this.getJvmInfo()
    this.timer = setInterval(() => {
      this.getJvmInfo()
    }, 3000)
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: 'Java虚拟机（JVM）'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['JVM已使用内存', 'JVM未使用内存']
        },
        series: [
          {
            name: 'JVM内存使用情况',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: this.jvm.used, name: 'JVM已使用内存' },
              { value: this.jvm.free, name: 'JVM未使用内存' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    getJvmInfo() {
      getJvmInfo().then(res => {
        this.jvm = res.data
        this.initChart()
      })
    }
  }
}
</script>
