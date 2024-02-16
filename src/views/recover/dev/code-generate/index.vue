<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="$t('table.dev.codeGenerate.name')" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.comment" :placeholder="$t('table.dev.codeGenerate.comment')" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.entityName" :placeholder="$t('table.dev.codeGenerate.entityName')" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.javaPackage" :placeholder="$t('table.dev.codeGenerate.javaPackage')" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.codeAuthor" :placeholder="$t('table.dev.codeGenerate.codeAuthor')" style="width: 150px;margin-right: 10px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
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
      highlight-current-row
      size="mini"
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.id')" type="index" sortable="true" align="center" width="60" />
      <el-table-column :label="$t('table.dev.codeGenerate.name')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.comment')" width="160px" align="center">
        <template v-slot="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.entityName')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.entityName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.javaCodePath')" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.javaCodePath }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.requestMapping')" width="90px" align="center">
        <template v-slot="{row}">
          <span>{{ row.requestMapping }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.javaPackage')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.javaPackage }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.vueCodePath')" width="140px" align="center">
        <template v-slot="{row}">
          <span>{{ row.vueCodePath }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.vuePackage')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.vuePackage }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.tree')" width="80px" align="center">
        <template v-slot="{row}">
          <span>{{ row.tree ? $t('common.true') : $t('common.false') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.cover')" width="80px" align="center">
        <template v-slot="{row}">
          <span>{{ row.cover ? $t('common.true') : $t('common.false') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.codeAuthor')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.codeAuthor }}</span>
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
  getTableInfoRecoverPage,
  recoverTableInfo,
  recoverDeleteTableInfo
} from '@/api/dev/code-generate'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'RecoverCodeGenerate',
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
        username: null,
        enabled: null,
        locked: null,
        accountExpire: null,
        passwordExpire: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      downloadLoading: false
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getTableInfoRecoverPage(this.page, this.listQuery).then(res => {
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
      recoverTableInfo(row.id).then(res => {
        this.loadData()
      })
    },
    handleRecoverDelete(row) {
      this.$confirm(this.$t('table.dev.codeGenerate.recoverDeleteTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        recoverDeleteTableInfo(row.id).then(res => {
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
<style scoped>

</style>
