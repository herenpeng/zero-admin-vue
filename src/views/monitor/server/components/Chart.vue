<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from '@/components/mixins/resize'

export default {
  name: 'Chart',
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
    },
    title: {
      type: String,
      default: ''
    },
    legendData: {
      type: Array,
      default() {
        return []
      }
    },
    seriesName: {
      type: String,
      default: ''
    },
    seriesData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    // newValue为新值,oldValue为旧值;
    seriesData(newValue, oldValue) {
      this.initChart()
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
  created() {
    // this.initChart()
  },
  methods: {
    initChart() {
      const data = []
      for (let i = 0; i < this.seriesData.length; i++) {
        data.push({ value: this.seriesData[i], name: this.legendData[i] })
      }
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.legendData
        },
        series: [
          {
            name: this.seriesName,
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
