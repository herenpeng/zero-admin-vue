<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.metaTitle" :placeholder="$t('table.data.menu.title')" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.path" :placeholder="$t('table.data.menu.path')" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.name" :placeholder="$t('table.data.menu.name')" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.enabled" :placeholder="$t('table.data.menu.enabled')" clearable style="width: 120px" class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="true" :label="$t('common.true')" />
        <el-option value="false" :label="$t('common.false')" />
      </el-select>
      <el-select v-model="listQuery.queryRoleId" :placeholder="$t('table.data.menu.roles')" clearable style="width: 100px;margin-right: 10px;"
                 class="filter-item" @change="handleFilter" @visible-change="getRoleList($event)"
      >
        <el-option
          v-for="role in roles"
          :key="role.id"
          :label="role.name"
          :value="role.id"
        />
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
      row-key="id"
      border
      fit
      size="mini"
      style="width: 100%;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.id')" type="index" sortable="true" align="center" width="80" />
      <el-table-column :label="$t('table.data.menu.title')" width="110">
        <template v-slot="{row}">
          <span>
            <i :class="row.metaIcon" />
            {{ row.metaTitle }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.menu.path')" width="150">
        <template v-slot="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.menu.name')" width="100px">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.menu.hidden')" width="70px" align="center">
        <template v-slot="{row}">
          <span>{{ row.hidden ? $t('table.data.menu.hide') : $t('table.data.menu.display') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.menu.enabled')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.enabled ? $t('table.data.menu.enable') : $t('table.data.menu.disable') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.menu.sort')" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.menu.roles')" class-name="status-col">
        <template v-slot="{row}">
          <el-tag
            v-for="(role,index) in row.roles"
            :key="index"
            :type="tagType[role.id]"
            style="margin-right: 3px;border-radius: 15px;"
            :title="role.description"
            size="mini"
          >
            {{ role.name }}
          </el-tag>
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
import Pagination from '@/components/Pagination/index.vue'
import { getMenuRecoverPage, recoverMenu, recoverDeleteMenu } from '@/api/data/menu'
import { getRoleList } from '@/api/data/role'

export default {
  name: 'RecoverMenu',
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
      getMenuRecoverPage(this.page, this.listQuery).then(res => {
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
      recoverMenu(row.id).then(res => {
        this.loadData()
      })
    },
    handleRecoverDelete(row) {
      this.$confirm(this.$t('table.data.menu.recoverDeleteTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        recoverDeleteMenu(row.id).then(res => {
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
    getRoleList(callback) {
      if (callback === true && this.roles === null) {
        getRoleList(null).then(res => {
          this.roles = res.data
        })
      }
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
