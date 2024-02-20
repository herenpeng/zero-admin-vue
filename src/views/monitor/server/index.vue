<template>
  <div class="dashboard-editor-container">

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <cpu-chart :cpu="chart.cpu" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <mem-chart :mem="chart.mem" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <jvm-chart :jvm="chart.jvm" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="64">
      <el-col :xs="36" :sm="36" :lg="12">
        <el-table
          :data="cpuInfo"
          :show-header="false"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template v-slot="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="核心数">
                  <span>{{ props.row.cpuNum }}</span>
                </el-form-item>
                <el-form-item label="当前空闲率">
                  <span>{{ props.row.free }}%</span>
                </el-form-item>
                <el-form-item label="用户使用率">
                  <span>{{ props.row.user }}%</span>
                </el-form-item>
                <el-form-item label="系统使用率">
                  <span>{{ props.row.sys }}%</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column>服务器CPU信息</el-table-column>
        </el-table>
      </el-col>
      <el-col :xs="36" :sm="36" :lg="12">
        <el-table
          :data="memInfo"
          :show-header="false"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template v-slot="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="总内存">
                  <span>{{ props.row.total }}G</span>
                </el-form-item>
                <el-form-item label="已用内存">
                  <span>{{ props.row.used }}G</span>
                </el-form-item>
                <el-form-item label="剩余内存">
                  <span>{{ props.row.free }}G</span>
                </el-form-item>
                <el-form-item label="使用率">
                  <span>{{ props.row.usage }}%</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column>服务器内存信息</el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="64">
      <el-col :xs="72" :sm="72" :lg="24">
        <el-table
          :data="jvmInfo"
          :show-header="false"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template v-slot="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="JVM名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="JDK版本">
                  <span>{{ props.row.version }}</span>
                </el-form-item>
                <el-form-item label="JDK路径">
                  <span>{{ props.row.home }}</span>
                </el-form-item>
                <el-form-item label="JVM启动时间">
                  <span>{{ props.row.startTime }}</span>
                </el-form-item>
                <el-form-item label="JVM运行时间">
                  <span>{{ props.row.runTime }}</span>
                </el-form-item>
                <el-form-item label="最大可用内存总数">
                  <span>{{ props.row.max }}MB</span>
                </el-form-item>
                <el-form-item label="占用的内存总数">
                  <span>{{ props.row.total }}MB</span>
                </el-form-item>
                <el-form-item label="内存使用率">
                  <span>{{ props.row.usage }}%</span>
                </el-form-item>
                <el-form-item label="空闲内存">
                  <span>{{ props.row.free }}MB</span>
                </el-form-item>
                <el-form-item label="使用内存">
                  <span>{{ props.row.used }}MB</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column>Java虚拟机（JVM）信息</el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row>
      <el-col :xs="72" :sm="72" :lg="24">
        <el-table
          :data="sysInfo"
          :show-header="false"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template v-slot="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="主机名称">
                  <span>{{ props.row.computerName }}</span>
                </el-form-item>
                <el-form-item label="主机IP">
                  <span>{{ props.row.computerIp }}</span>
                </el-form-item>
                <el-form-item label="操作系统">
                  <span>{{ props.row.osName }}</span>
                </el-form-item>
                <el-form-item label="系统架构">
                  <span>{{ props.row.osArch }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column>服务器信息</el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="64">
      <el-col :xs="72" :sm="72" :lg="24">
        <el-table
          :data="sysFiles"
          stripe
          style="width: 100%"
        >
          <el-table-column
            prop="dirName"
            label="盘符路径"
          />
          <el-table-column
            prop="sysTypeName"
            label="盘符类型"
          />
          <el-table-column
            prop="typeName"
            label="文件类型"
          />
          <el-table-column
            prop="total"
            label="总大小"
          />
          <el-table-column
            prop="free"
            label="剩余大小"
          />
          <el-table-column
            prop="used"
            label="已经使用量"
          />
          <el-table-column
            prop="usage"
            label="资源的使用率"
          >
            <template v-slot="{row}">
              <span>{{ row.usage }}%</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CpuChart from './components/CpuChart'
import MemChart from './components/MemChart'
import JvmChart from './components/JvmChart'
import { getServerChartInfo, getServerInfo } from '@/api/monitor/server'
import webSocket, { WEBSOCKET_CMD } from '@/utils/websocket'

export default {
  name: 'Info',
  components: {
    CpuChart,
    MemChart,
    JvmChart
  },
  data() {
    return {
      cpuInfo: [],
      memInfo: [],
      sysInfo: [],
      jvmInfo: [],
      sysFiles: [],
      chart: {
        cpu: { user: 0, sys: 0 },
        mem: { used: 0, free: 0 },
        jvm: { used: 0, free: 0 }
      },
      timer: null
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  created() {
    this.loadData()
    if (webSocket) {
      webSocket.register(WEBSOCKET_CMD.SERVER, data => {
        this.chart = JSON.parse(data)
      })
    } else {
      this.getServerChartInfo()
      this.timer = setInterval(() => {
        this.getServerChartInfo()
      }, 3000)
    }
  },
  methods: {
    loadData() {
      getServerInfo().then(res => {
        this.cpuInfo.push(res.data.cpu)
        this.memInfo.push(res.data.mem)
        this.sysInfo.push(res.data.sys)
        this.jvmInfo.push(res.data.jvm)
        this.sysFiles = res.data.sysFiles
      })
    },
    getServerChartInfo() {
      getServerChartInfo().then(res => {
        this.chart = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  .el-row {
    margin-bottom: 20px;
    &:first-child {
      margin-bottom: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
