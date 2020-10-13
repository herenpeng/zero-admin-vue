<template>
  <div class="dashboard-editor-container">
    <!--    <github-corner class="github-corner" />-->

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <cpu-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <mem-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <jvm-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="64">
      <el-col :xs="72" :sm="72" :lg="24">
        <el-table
          :data="cpuInfo"
          :show-header="false"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="核心数">
                  <span>{{ props.row.cpuNum }}</span>
                </el-form-item>
                <el-form-item label="用户使用率">
                  <span>{{ props.row.used }}%</span>
                </el-form-item>
                <el-form-item label="系统使用率">
                  <span>{{ props.row.sys }}%</span>
                </el-form-item>
                <el-form-item label="当前空闲率">
                  <span>{{ props.row.free }}%</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column>系统CPU详细参数</el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="64">
      <el-col :xs="72" :sm="72" :lg="24">
        <el-table
          :data="memInfo"
          :show-header="false"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
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
          <el-table-column>系统内存详细参数</el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CpuChart from './components/CpuChart'
import MemChart from './components/MemChart'
import JvmChart from './components/JvmChart'
import { getServerInfo } from '@/api/system/server'

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
      memInfo: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getServerInfo().then(res => {
        this.cpuInfo.push(res.data.cpu)
        this.memInfo.push(res.data.mem)
        // this.cpuInfo[0].value = res.data.cpu.cpuNum
        // this.cpuInfo[1].value = res.data.cpu.used + '%'
        // this.cpuInfo[2].value = res.data.cpu.sys + '%'
        // this.cpuInfo[3].value = res.data.cpu.free + '%'

        // this.memInfo[0].value = res.data.mem.total + 'G'
        // this.memInfo[1].value = res.data.mem.used + 'G'
        // this.memInfo[2].value = res.data.mem.free + 'G'
        // this.memInfo[3].value = res.data.mem.usage + '%'
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
