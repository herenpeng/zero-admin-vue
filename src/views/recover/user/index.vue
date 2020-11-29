<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.enabled" placeholder="是否启用" clearable style="width: 120px" class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="true" label="是" />
        <el-option value="false" label="否" />
      </el-select>
      <el-select v-model="listQuery.locked" placeholder="是否锁定" clearable class="filter-item"
                 style="width: 120px"
                 @change="handleFilter"
      >
        <el-option value="true" label="是" />
        <el-option value="false" label="否" />
      </el-select>
      <el-select v-model="listQuery.accountExpire" placeholder="账号是否过期" clearable style="width: 140px" class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="true" label="是" />
        <el-option value="false" label="否" />
      </el-select>
      <el-select v-model="listQuery.passwordExpire" placeholder="密码是否过期" clearable style="width: 140px;" class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="true" label="是" />
        <el-option value="false" label="否" />
      </el-select>
      <el-select v-model="listQuery.roleId" placeholder="角色" clearable style="width: 100px;margin-right: 10px;"
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
      @sort-change="sortChange"
    >
      <el-table-column label="序号" type="index" sortable="true" align="center" width="80" />
      <el-table-column label="用户名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.enabled | enabledFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否锁定" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.locked | lockedFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号是否过期" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.accountExpire | expireFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码是否过期" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.passwordExpire | expireFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" class-name="status-col" width="300px">
        <template slot-scope="{row}">
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" icon="el-icon-finished" @click="handleRecover(row)">
            数据恢复
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteData(row)">
            彻底删除
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
  getUserDeletePage,
  recoverUser,
  deleteUser
} from '@/api/data/user'
import { getRoleList } from '@/api/data/role'
import Pagination from '@/components/Pagination'

export default {
  name: 'User',
  components: { Pagination },
  filters: {
    enabledFilter(enabledValue) {
      if (enabledValue) {
        return '启用'
      } else {
        return '禁用'
      }
    },
    lockedFilter(lockedValue) {
      if (lockedValue) {
        return '锁定'
      } else {
        return '未锁定'
      }
    },
    expireFilter(expireValue) {
      if (expireValue) {
        return '过期'
      } else {
        return '未过期'
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
      listQuery: {
        username: null,
        enabled: null,
        locked: null,
        accountExpire: null,
        passwordExpire: null,
        roleId: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      user: {
        id: null,
        username: null,
        enabled: true,
        locked: false,
        accountExpire: false,
        passwordExpire: false
      },
      roles: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '添加',
        update: '编辑'
      },
      notRoleList: [],
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getUserDeletePage(this.page, this.listQuery).then(res => {
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
      recoverUser(row.id).then(res => {
        this.loadData()
      })
    },
    deleteData(row) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(res => {
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
<style scoped>

</style>
