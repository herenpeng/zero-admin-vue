<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.enabled" placeholder="是否启用" clearable style="width: 120px" class="filter-item">
        <el-option value="true" label="是"/>
        <el-option value="false" label="否"/>
      </el-select>
      <el-select v-model="listQuery.locked" placeholder="是否锁定" clearable class="filter-item"
                 style="width: 130px">
        <el-option value="true" label="是"/>
        <el-option value="false" label="否"/>
      </el-select>
      <el-select v-model="listQuery.accountExpire" placeholder="账号是否过期" style="width: 140px" class="filter-item"
                 @change="handleFilter">
        <el-option value="true" label="是"/>
        <el-option value="false" label="否"/>
      </el-select>
      <el-select v-model="listQuery.passwordExpire" placeholder="密码是否过期" style="width: 140px;margin-right: 10px;"
                 class="filter-item" @change="handleFilter">
        <el-option value="true" label="是"/>
        <el-option value="false" label="否"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        添加
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="150px" align="center">
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
            v-for="role in row.roles"
            :key="role"
            closable
            :type="tagType[role.id]"
            @close="handleClose(row, role)"
            style="margin-right: 5px;border-radius: 15px;"
            :title="role.description">
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.enabled === false" size="mini" type="success" @click="enabled(row, true)">
            启用
          </el-button>
          <el-button v-if="row.enabled === true" size="mini" @click="enabled(row, false)">
            禁用
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="user" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-switch
            v-model="user.enabled"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
        <el-form-item label="是否锁定" prop="locked">
          <el-switch
            v-model="user.locked"
            active-text="锁定"
            inactive-text="未锁定">
          </el-switch>
        </el-form-item>
        <el-form-item label="账号是否过期">
          <el-switch
            v-model="user.accountExpire"
            active-text="过期"
            inactive-text="未过期">
          </el-switch>
        </el-form-item>
        <el-form-item label="密码是否过期">
          <el-switch
            v-model="user.passwordExpire"
            active-text="过期"
            inactive-text="未过期">
          </el-switch>
        </el-form-item>
        <el-form-item label="用户角色">
          <!--          <el-input v-model="user.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"-->
          <!--                    placeholder="Please input"/>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ ('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserPage, enabled, fetchPv, createUser, updateArticle } from '@/api/system/user'
import Pagination from '@/components/Pagination'
// import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'

export default {
  name: 'User',
  components: { Pagination },
  // directives: { waves },
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
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        size: 10,
        username: '',
        enabled: undefined,
        locked: undefined,
        accountExpire: undefined,
        passwordExpire: undefined
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      user: {
        id: 1,
        username: '',
        enabled: true,
        locked: false,
        accountExpire: false,
        passwordExpire: false
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '添加',
        update: '编辑'
      },
      dialogPvVisible: false,
      pvData: [],
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
      getUserPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = 2
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    enabled(row, value) {
      enabled(row.id, value).then(res => {
        row.enabled = value
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const userData = Object.assign({}, this.user)
          createUser(userData).then(() => {
            this.list.unshift(this.user)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.user = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleClose(row, role) {
      alert('删除角色成功')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
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
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
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
