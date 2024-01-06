<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.queryUsername" placeholder="登入用户" style="width: 120px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.ip" placeholder="登入IP地址" style="width: 120px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.queryAddress" placeholder="登入地址" style="width: 120px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.isp" placeholder="因特网提供商" style="width: 120px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="queryDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="登入开始日期"
        end-placeholder="登入结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
      />
      <el-select v-model="listQuery.logout" placeholder="是否主动登出" clearable class="filter-item"
                 style="width: 130px;" @change="handleFilter"
      >
        <el-option value="true" label="是" />
        <el-option value="false" label="否" />
      </el-select>
      <el-select v-model="listQuery.queryOnline" placeholder="账号状态" clearable class="filter-item"
                 style="width: 110px;margin-right: 10px;" @change="handleFilter"
      >
        <el-option value="true" label="在线" />
        <el-option value="false" label="已登出" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload"
      >
        导出
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
      <el-table-column label="序号" type="index" align="center" width="80" />
      <el-table-column label="登入用户" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登入IP地址" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登入地址" align="center">
        <template v-slot="{row}">
          <span>{{ row.country }} {{ row.region }} {{ row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="因特网提供商" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.isp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登入时间" width="140px" align="center" sortable prop="accessTime">
        <template v-slot="{row}">
          <span>{{ row.loginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登出时间" width="140px" align="center">
        <template v-slot="{row}">
          <span>{{ row.logoutTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否主动登出" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.logout | logoutFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号状态" width="80px" align="center">
        <template v-slot="{row}">
          <span v-if="row.logout === false && Date.parse(row.logoutTime) > new Date()">在线</span>
          <span v-else>已登出</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="200px" class-name="small-padding fixed-width">
        <template v-slot="{row}">
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteData(row)">
            删除
          </el-button>
          <el-button v-if="row.logout === false && Date.parse(row.logoutTime) > new Date()"
                     size="mini" type="danger" icon="el-icon-thumb" @click="offline(row)"
          >
            下线
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
  getLoginLogPage,
  deleteLoginLog,
  exportLoginLogExcel,
  offline,
  online
} from '@/api/monitor/login-log'
import Pagination from '@/components/Pagination'

export default {
  name: 'LoginLog',
  components: { Pagination },
  filters: {
    logoutFilter(logoutValue) {
      if (logoutValue) {
        return '是'
      } else {
        return '否'
      }
    }
  },
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
      getLoginLogPage(this.page, this.listQuery).then(res => {
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
    deleteData(row) {
      this.$confirm('此操作将删除该登入日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLoginLog(row.id).then(res => {
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
    offline(row) {
      offline(row.userId, row.tokenId).then(res => {
        online(row.userId).then(res => {
          this.loadData()
        })
        this.$message({
          type: 'success',
          message: '该登入用户已下线'
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
      exportLoginLogExcel(this.listQuery, '登入日志列表')
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
