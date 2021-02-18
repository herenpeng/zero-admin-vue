<template>
  <div class="app-container">
    <el-table :data="onlineLoginLogs" style="width: 100%">
      <el-table-column prop="loginTime" label="登入时间" width="180" align="center" />
      <el-table-column label="登入地点" width="250" align="center">
        <template slot-scope="{row}">
          <span>{{ row.country }} {{ row.region }} {{ row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="登入IP" width="100" align="center" />
      <el-table-column prop="isp" label="因特网提供商" width="120" align="center" />
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" icon="el-icon-thumb" @click="offline(row)">
            下线
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'LoginLog',
  props: {
    onlineLoginLogs: {
      type: Array,
      default: null
    }
  },
  methods: {
    offline(row) {
      this.$emit('offline', row.userId, row.tokenId)
    }
  }
}
</script>

<style scoped>

</style>
