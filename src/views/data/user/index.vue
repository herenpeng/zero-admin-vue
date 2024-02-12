<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" :placeholder="$t('table.data.user.username')" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.enabled" :placeholder="$t('table.data.user.enabled')" clearable style="width: 120px" class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="true" label="是" />
        <el-option value="false" label="否" />
      </el-select>
      <el-select v-model="listQuery.locked" :placeholder="$t('table.data.user.locked')" clearable class="filter-item"
                 style="width: 120px"
                 @change="handleFilter"
      >
        <el-option value="true" label="是" />
        <el-option value="false" label="否" />
      </el-select>
      <el-select v-model="listQuery.accountExpire" :placeholder="$t('table.data.user.accountExpire')" clearable style="width: 140px"
                 class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="true" label="是" />
        <el-option value="false" label="否" />
      </el-select>
      <el-select v-model="listQuery.passwordExpire" :placeholder="$t('table.data.user.passwordExpire')" clearable style="width: 140px;"
                 class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="true" label="是" />
        <el-option value="false" label="否" />
      </el-select>
      <el-select v-model="listQuery.queryRoleId" :placeholder="$t('table.data.user.roles')" clearable style="width: 100px;margin-right: 10px;"
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate"
      >
        {{ $t('table.add') }}
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
      <el-table-column :label="$t('table.id')" type="index" sortable="true" align="center" width="80px" />
      <el-table-column :label="$t('table.data.user.username')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.user.enabled')" width="150px" align="center">
        <template v-slot="{row}">
          <el-switch
            v-model="row.enabled"
            active-text="是"
            inactive-text="否"
            @change="enabled(row)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.user.locked')" width="130px" align="center">
        <template v-slot="{row}">
          <span>{{ row.locked ? '锁定' : '未锁定' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.user.accountExpire')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.accountExpire ? '过期' : '未过期' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.user.passwordExpire')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.passwordExpire ? '过期' : '未过期' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.user.state')" width="100px" align="center">
        <template v-slot="{row}">
          <el-link v-if="row.onlineLoginLogs.length === 0" type="info" :underline="false" style="font-size: 12px;">未登录
          </el-link>
          <el-link v-else type="success" style="font-size: 12px;" @click="loginLog(row)">在线{{ row.onlineLoginLogs.length }}人
          </el-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.user.roles')" class-name="status-col">
        <template v-slot="{row}">
          <el-tag
            v-for="(role,index) in row.roles"
            :key="index"
            closable
            :type="tagType[role.id]"
            style="margin-right: 3px;border-radius: 15px;"
            :title="role.description"
            size="mini"
            @close="deleteUserRole(row.id, role.id)"
          >
            {{ role.name }}
          </el-tag>
          <el-dropdown trigger="click" @command="addUserRole(row.id, $event)">
            <el-button style="border-radius: 20px;" size="mini" @click="getUserNotRoleList(row.id)">+</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(role,index) in notRoleList"
                :key="index"
                :title="role.description"
                :command="role.id"
              >{{ role.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width" width="220px" fixed="right">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteData(row)">
            {{ $t('table.delete') }}
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

    <el-dialog :title="$t(textMap[dialogStatus])" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="user" label-position="left" label-width="160px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.data.user.username')" prop="username">
          <el-input v-model="user.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item :label="$t('table.data.user.enabled')" prop="enabled">
          <el-switch
            v-model="user.enabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item :label="$t('table.data.user.locked')" prop="locked">
          <el-switch
            v-model="user.locked"
            active-text="锁定"
            inactive-text="未锁定"
          />
        </el-form-item>
        <el-form-item :label="$t('table.data.user.accountExpire')">
          <el-switch
            v-model="user.accountExpire"
            active-text="过期"
            inactive-text="未过期"
          />
        </el-form-item>
        <el-form-item :label="$t('table.data.user.passwordExpire')">
          <el-switch
            v-model="user.passwordExpire"
            active-text="过期"
            inactive-text="未过期"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.close') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.save') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="在线账号" :visible.sync="loginLogDialogVisible" width="60%">
      <login-log :online-login-logs="onlineLoginLogs" @offline="offline" />
    </el-dialog>

  </div>
</template>

<script>
import {
  getUserPage,
  enabledUser,
  createUser,
  updateUser,
  deleteUser,
  deleteUserRole,
  getUserNotRoleList,
  addUserRole,
  checkUsername,
  exportUserExcel
} from '@/api/data/user'
import { getRoleList } from '@/api/data/role'
import Pagination from '@/components/Pagination'
import LoginLog from './components/LoginLog'
import { offline, online } from '@/api/monitor/login-log'

export default {
  name: 'User',
  components: { Pagination, LoginLog },
  data() {
    const checkUsername = (rule, value, callback) => {
      if (value === this.oldUsername && this.dialogStatus === 'update') {
        callback()
      } else {
        this.checkUsername(value).then(res => {
          if (res.data) {
            callback(new Error('该用户已存在'))
          } else {
            callback()
          }
        })
      }
    }
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
        queryRoleId: null
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
      oldUsername: null,
      roles: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: 'table.add',
        update: 'table.edit'
      },
      notRoleList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { validator: checkUsername, trigger: 'change' }
        ]
      },
      downloadLoading: false,
      loginLogDialogVisible: false,
      onlineLoginLogs: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getUserPage(this.page, this.listQuery).then(res => {
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
    enabled(row) {
      enabledUser(row.id, row.enabled).then(res => {
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        this.loadData()
      })
    },
    checkUsername(value) {
      return checkUsername(value)
    },
    handleCreate() {
      this.user = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.user).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.loadData()
          })
        }
      })
    },
    handleUpdate(row) {
      this.user = Object.assign({}, row)
      this.oldUsername = this.user.username
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUser(this.user).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.loadData()
          })
        }
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
    deleteUserRole(userId, roleId) {
      deleteUserRole(userId, roleId).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.loadData()
      })
    },
    getUserNotRoleList(id) {
      getUserNotRoleList(id).then(res => {
        const list = res.data
        if (list.length === 0) {
          this.notRoleList = null
          this.$message({
            type: 'warning',
            message: '该用户已拥有所有角色，无法添加'
          })
        } else {
          this.notRoleList = list
        }
      })
    },
    addUserRole(userId, roleId) {
      addUserRole(userId, roleId).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.loadData()
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
    loginLog(row) {
      this.loginLogDialogVisible = true
      this.onlineLoginLogs = row.onlineLoginLogs
    },
    offline(userId, tokenId) {
      this.$confirm('此操作将强制该用户的在线账号登出, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        offline(userId, tokenId).then(res => {
          online(userId).then(res => {
            this.onlineLoginLogs = res.data
            this.loadData()
          })
          this.$message({
            type: 'success',
            message: '该登录用户已下线'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
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
      exportUserExcel(this.listQuery, '用户列表')
    }
  }
}
</script>
<style scoped>

</style>
