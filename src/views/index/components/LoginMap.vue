<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/map/js/china')
require('echarts/theme/macarons')
import resize from '@/components/mixins/resize'
import { getLoginMap } from '@/api/index/index'

export default {
  name: 'LoginMap',
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
      default: '500px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      loginMap: []
    }
  },
  watch: {
    // newValue为新值,oldValue为旧值;
    loginMap(newValue, oldValue) {
      this.initChart()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
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
    loadData() {
      getLoginMap().then(res => {
        this.loginMap = res.data
      })
    },
    initChart: function() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: '系统访问用户分布地图',
          left: 'center'
        },
        // 鼠标移到图里面的浮动提示框
        tooltip: {
          // formatter详细配置： https://echarts.baidu.com/option.html#tooltip.formatter
          formatter(params, ticket, callback) {
            // params.data 就是series配置项中的data数据遍历
            let user = 0
            let value = 0
            if (params.data) {
              user = params.data.user
              value = params.data.value
            }
            const htmlStr = `
              <div style='font-size:18px; text-align: center;'> ${params.name}</div>
              <p>
                访问用户数：${user}<br/>
                访问次数：${value}<br/>
              </p>`
            return htmlStr
          }
          // backgroundColor:"#ff7f50",//提示标签背景颜色
          // textStyle:{color:"#fff"} //提示标签字体颜色
        },
        // visualMap的详细配置解析：https://echarts.baidu.com/option.html#visualMap
        // 左下角的颜色区域
        visualMap: {
          // 定义为分段型 visualMap
          type: 'piecewise',
          min: 0,
          max: 1000,
          itemWidth: 40,
          bottom: 60,
          left: 20,
          pieces: [ // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
            { gt: 500, label: '访问用户非常多', color: '#FF4500' },
            { gt: 100, lte: 500, label: '访问用户较多', color: '#ff9800' },
            { gt: 50, lte: 100, label: '访问用户多', color: '#ffeb3b' },
            { gt: 10, lte: 50, label: '访问用户少', color: '#9adcfa' },
            { gt: 0, lte: 10, label: '访问用户较少', color: '#6ad86e' },
            { value: 0, label: '无数据', color: '#999' } // [0]
          ]
        },
        // geo配置详解： https://echarts.baidu.com/option.html#geo
        geo: { // 地理坐标系组件用于地图的绘制
          map: 'china', // 表示中国地图
          // roam: true, // 是否开启鼠标缩放和平移漫游
          zoom: 1.2, // 当前视角的缩放比例（地图的放大比例）
          label: {
            show: true
          },
          itemStyle: { // 地图区域的多边形 图形样式。
            borderColor: 'rgba(0, 0, 0, 0.2)',
            emphasis: { // 高亮状态下的多边形和标签样式
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [
          {
            // 浮动框的标题（上面的formatter自定义了提示框数据，所以这里可不写）
            name: '',
            type: 'map',
            geoIndex: 0,
            label: {
              show: true
            },
            // 这是需要配置地图上的某个地区的数据，根据后台的返回的数据进行拼接（下面是我定义的假数据）
            data: this.loginMap
          }
        ]
      })
    }
  }
}
</script>
