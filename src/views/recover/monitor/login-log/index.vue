<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.queryUsername" :placeholder="$t('table.monitor.loginLog.user')" style="width: 120px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.ip" :placeholder="$t('table.monitor.loginLog.ip')" style="width: 120px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.queryAddress" :placeholder="$t('table.monitor.loginLog.address')" style="width: 120px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.isp" :placeholder="$t('table.monitor.loginLog.isp')" style="width: 120px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="queryDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="~"
        :start-placeholder="$t('table.startTime')"
        :end-placeholder="$t('table.endTime')"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
      />
      <el-select v-model="listQuery.logout" :placeholder="$t('table.monitor.loginLog.logout')" clearable class="filter-item"
                 style="width: 130px;" @change="handleFilter"
      >
        <el-option value="true" :label="$t('common.true')" />
        <el-option value="false" :label="$t('common.false')" />
      </el-select>
      <el-select v-model="listQuery.queryOnline" :placeholder="$t('table.monitor.loginLog.state')" clearable class="filter-item"
                 style="width: 110px;margin-right: 10px;" @change="handleFilter"
      >
        <el-option value="true" :label="$t('table.monitor.loginLog.online')" />
        <el-option value="false" :label="$t('table.monitor.loginLog.offline')" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload"
      >
        {{ $t('table.export') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      size="mini"
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.id')" type="index" align="center" width="50" />
      <el-table-column :label="$t('table.monitor.loginLog.user')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.ip')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.address')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.country }} {{ row.region }} {{ row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.isp')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.isp }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.mobile')" width="70px" align="center">
        <template v-slot="{row}">
          <span>{{ row.mobile ? $t('common.true') : $t('common.false') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.browserName')" width="90px" align="center">
        <template v-slot="{row}">
          <span><el-tag type="success" effect="dark">{{ row.browserName }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.browserVersion')" width="90px" align="center">
        <template v-slot="{row}">
          <span>{{ row.browserVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.osName')" width="240px" align="center">
        <template v-slot="{row}">
          <span>{{ row.osName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.loginTime')" width="140px" align="center" sortable prop="accessTime">
        <template v-slot="{row}">
          <span>{{ row.loginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.logoutTime')" width="140px" align="center">
        <template v-slot="{row}">
          <span>{{ row.logoutTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.logout')" width="80px" align="center">
        <template v-slot="{row}">
          <span>{{ row.logout ? $t('common.true') : $t('common.false') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.loginLog.state')" width="80px" align="center">
        <template v-slot="{row}">
          <span v-if="row.logout === false && Date.parse(row.logoutTime) > new Date()">{{ $t('table.monitor.loginLog.online') }}</span>
          <span v-else>{{ $t('table.monitor.loginLog.offline') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="300px" class-name="small-padding fixed-width" fixed="right">
        <template v-slot="{row}">
          <el-button type="success" size="mini" icon="el-icon-finished" @click="handleRecover(row)">
            {{ $t('table.recovery') }}
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleRecoverDelete(row)">
            {{ $t('table.deleteRecovery') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="page.total > 0"
                :total="page.total"
                :page="page.currentPage"
                :limit="page.size"
                @pagination="handlePagination"
    />
  </div>
</template>

<script>
import {
  getLoginLogRecoverPage,
  recoverLoginLog,
  recoverDeleteLoginLog
} from '@/api/monitor/login-log'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'RecoverLoginLog',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      listLoading: false,
      queryDate: null,
      listQuery: {
        ip: null,
        isp: null,
        logout: null,
        queryUsername: null,
        queryAddress: null,
        queryStartDate: null,
        queryEndDate: null,
        queryOnline: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      downloadLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  watch: {
    queryDate(newValue, oldValue) {
      if (newValue === null) {
        this.listQuery.queryStartDate = null
        this.listQuery.queryEndDate = null
      } else {
        this.listQuery.queryStartDate = newValue[0]
        this.listQuery.queryEndDate = newValue[1]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getLoginLogRecoverPage(this.page, this.listQuery).then(res => {
        setTimeout(() => {
          if (this.listLoading === true) {
            this.listLoading = false
          }
        }, 1000)
        const page = res.data
        this.list = page.records
        this.page.total = page.total
        this.listLoading = false
      })
    },
    handlePagination(page) {
      this.page.currentPage = page.page
      this.page.size = page.limit
      this.loadData()
    },
    handleRecover(row) {
      recoverLoginLog(row.id).then(res => {
        this.loadData()
      })
    },
    handleRecoverDelete(row) {
      this.$confirm('此操作将彻底删除该登录日志, 数据将不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recoverDeleteLoginLog(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.loadData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFilter() {
      this.page.currentPage = 1
      this.loadData()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>
<style scoped>
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
