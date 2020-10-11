<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <cpu-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <ram-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <jvm-chart />
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import CpuChart from './components/CpuChart'
import RamChart from './components/RamChart'
import JvmChart from './components/JvmChart'

export default {
  name: 'Info',
  components: {
    CpuChart,
    RamChart,
    JvmChart
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

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
