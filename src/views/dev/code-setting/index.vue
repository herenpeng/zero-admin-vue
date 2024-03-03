<template>
  <div class="app-container">
    <el-tabs v-model="tabPaneName">
      <el-tab-pane :label="$t('table.dev.codeGenerate.tableInfo')" name="tableInfo">
        <table-info />
      </el-tab-pane>

      <el-tab-pane :label="$t('table.dev.codeGenerate.tableColumn')" name="tableColumn">
        <table-column />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TableInfo from './components/TableInfo'
import TableColumn from './components/TableColumn'

export default {
  name: 'CodeSetting',
  components: { TableInfo, TableColumn },
  data() {
    return {
      tabPaneName: 'tableInfo'
    }
  }
}
</script>

<style scoped>

</style>
