<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.queryUsername" :placeholder="$t('table.monitor.operationLog.user')" style="width: 180px;" class="filter-item"
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
      <el-input v-model="listQuery.ip" :placeholder="$t('table.monitor.operationLog.ip')" style="width: 150px" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.uri" :placeholder="$t('table.monitor.operationLog.uri')" style="width: 150px" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.methodType" :placeholder="$t('table.monitor.operationLog.methodType')" clearable class="filter-item"
                 style="width: 110px;" @change="handleFilter"
      >
        <el-option value="GET" label="GET" />
        <el-option value="POST" label="POST" />
        <el-option value="PUT" label="PUT" />
        <el-option value="DELETE" label="DELETE" />
      </el-select>
      <el-select v-model="listQuery.result" :placeholder="$t('table.monitor.operationLog.user')" clearable class="filter-item"
                 style="width: 110px;margin-right: 10px;" @change="handleFilter"
      >
        <el-option value="true" label="成功" />
        <el-option value="false" label="失败" />
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
      <el-table-column type="expand">
        <template v-slot="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item :label="$t('table.monitor.operationLog.description')">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item :label="$t('table.monitor.operationLog.method')">
              <span>{{ props.row.method }}</span>
            </el-form-item>
            <el-form-item v-if="props.row.exceptionName != null" :label="$t('table.monitor.operationLog.exceptionName')">
              <span>{{ props.row.exceptionName }}</span>
            </el-form-item>
            <el-form-item v-if="props.row.exceptionMessage != null" :label="$t('table.monitor.operationLog.exceptionMessage')">
              <span>{{ props.row.exceptionMessage }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.id')" type="index" align="center" width="60" />
      <el-table-column :label="$t('table.monitor.operationLog.user')" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.operationLog.accessTime')" width="160px" align="center" sortable prop="accessTime">
        <template v-slot="{row}">
          <span>{{ row.accessTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.operationLog.ip')" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.operationLog.uri')" align="center">
        <template v-slot="{row}">
          <span>{{ row.uri }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.operationLog.methodType')" width="120px" align="center">
        <template v-slot="{row}">
          <span><el-tag :type="tagType[row.methodType]" effect="dark">{{ row.methodType }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.operationLog.executionTime')" width="110px" align="center">
        <template v-slot="{row}">
          <span>{{ row.executionTime }}ms</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.monitor.operationLog.result')" width="80px" align="center">
        <template v-slot="{row}">
          <span>
            <el-button v-if="row.result" size="mini" type="success" icon="el-icon-check" circle />
            <el-button v-else size="mini" type="warning" icon="el-icon-message-solid" circle />
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="300px" class-name="small-padding fixed-width">
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
  getOperationLogRecoverPage,
  recoverOperationLog,
  recoverDeleteOperationLog
} from '@/api/monitor/operation-log'
import Pagination from '@/components/Pagination'

export default {
  name: 'RecoverOperationLog',
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
        uri: null,
        methodType: null,
        result: null,
        queryUsername: null,
        queryStartDate: null,
        queryEndDate: null
      },
      tagType: { 'GET': '', 'POST': 'success', 'PUT': 'warning', 'DELETE': 'danger' },
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
      getOperationLogRecoverPage(this.page, this.listQuery).then(res => {
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
      recoverOperationLog(row.id).then(res => {
        this.loadData()
      })
    },
    handleRecoverDelete(row) {
      this.$confirm('此操作将彻底删除该操作日志, 数据将不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recoverDeleteOperationLog(row.id).then(res => {
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
