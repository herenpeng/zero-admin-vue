<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="操作用户" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="queryDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
      />
      <el-input v-model="listQuery.ip" placeholder="访问IP地址" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.uri" placeholder="访问URI" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.methodType" placeholder="方法类型" clearable class="filter-item"
                 style="width: 130px" @change="handleFilter"
      >
        <el-option value="GET" label="GET" />
        <el-option value="POST" label="POST" />
        <el-option value="PUT" label="PUT" />
        <el-option value="DELETE" label="DELETE" />
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
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="操作信息">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label="访问方法">
              <span>{{ props.row.method }}</span>
            </el-form-item>
            <el-form-item label="异常名称" v-if="props.row.exceptionName != null">
              <span>{{ props.row.exceptionName }}</span>
            </el-form-item>
            <el-form-item label="异常信息" v-if="props.row.exceptionMessage != null">
              <span>{{ props.row.exceptionMessage }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" align="center" width="80" />
      <el-table-column label="操作用户" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问时间" width="200px" align="center" sortable prop="accessTime">
        <template slot-scope="{row}">
          <span>{{ row.accessTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问IP地址" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问URI" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.uri }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问方法类型" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.methodType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作执行时间" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.executionTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行结果" width="80px" align="center">
        <template slot-scope="{row}">
          <span>
            <el-button v-if="row.exceptionName == null" type="success" icon="el-icon-check" circle></el-button>
            <el-button v-if="row.exceptionName != null" type="warning" icon="el-icon-message-solid" circle></el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="deleteData(row)">
            删除
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
  getLogPage,
  deleteLog
} from '@/api/system/log'
import Pagination from '@/components/Pagination'

export default {
  name: 'Log',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      page: {
        currentPage: 1,
        size: 8,
        total: 0
      },
      listLoading: true,
      queryDate: null,
      listQuery: {
        username: null,
        ip: null,
        uri: null,
        methodType: null,
        queryStartDate: null,
        queryEndDate: null
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
      getLogPage(this.page, this.listQuery).then(res => {
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
    deleteData(row, index) {
      this.$confirm('此操作将删除该操作日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLog(row.id).then(res => {
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
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
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
