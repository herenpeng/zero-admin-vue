<template>
  <div class="app-container">
    <el-table :data="onlineLoginLogs" style="width: 100%">
      <el-table-column prop="loginTime" :label="$t('table.data.user.loginTime')" width="180" align="center" />
      <el-table-column :label="$t('table.data.user.loginAddress')" width="250" align="center">
        <template v-slot="{row}">
          <span>{{ row.country }} {{ row.region }} {{ row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ip" :label="$t('table.data.user.loginIp')" width="130" align="center" />
      <el-table-column prop="isp" :label="$t('table.data.user.loginIsp')" width="120" align="center" />
      <el-table-column :label="$t('table.actions')" width="150" align="center">
        <template v-slot="{row}">
          <el-button type="danger" size="mini" icon="el-icon-thumb" @click="offline(row)">
            {{ $t('table.data.user.offline') }}
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
