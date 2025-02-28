<template>
  <div class="app-container">
    <div class="filter-container">
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
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.id')" type="index" sortable="true" align="center" width="80" />
      <el-table-column :label="$t('table.data.quartzJob.name')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.quartzJob.groupName')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.quartzJob.status')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.status ? $t('common.true') : $t('common.false') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.quartzJob.expression')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.expression }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.quartzJob.description')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.quartzJob.concurrent')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.concurrent ? $t('common.true') : $t('common.false') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.quartzJob.beanClass')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.beanClass }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.quartzJob.method')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.method }}</span>
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
  getQuartzJobRecoverPage,
  recoverQuartzJob,
  recoverDeleteQuartzJob
} from '@/api/data/quartz-job'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'RecoverQuartzJob',
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
      listQuery: {
        path: null,
        name: null,
        metaTitle: null,
        enabled: null,
        queryRoleId: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      roles: null,
      downloadLoading: false
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getQuartzJobRecoverPage(this.page, this.listQuery).then(res => {
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
      recoverQuartzJob(row.id).then(res => {
        this.loadData()
      })
    },
    handleRecoverDelete(row) {
      this.$confirm(this.$t('common.recoverDeleteTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        recoverDeleteQuartzJob(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.loadData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('common.cancelDelete')
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
