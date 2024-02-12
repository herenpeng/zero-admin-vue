<template>
  <div class="app-container">
    <div class="filter-container">
      <el-autocomplete
        v-model="listQuery.queryKey"
        :fetch-suggestions="getKeyList"
        :placeholder="$t('table.setting.userConfig.key')"
        clearable
        @select="handleFilter"
      />
      <el-input v-model="listQuery.queryUsername" :placeholder="$t('table.setting.userConfig.username')" style="width: 180px; margin-right: 10px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
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
      <el-table-column :label="$t('table.id')" type="index" sortable="true" align="center" width="80" />
      <el-table-column :label="$t('table.setting.userConfig.key')" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.configConst.key }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.setting.userConfig.username')" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.setting.userConfig.description')" align="center">
        <template v-slot="{row}">
          <span>{{ row.configConst.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.setting.userConfig.defaultValue')" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.configConst.defaultValue }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.setting.userConfig.value')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.value }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="userConfig" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.setting.userConfig.value')" prop="value">
          <el-input v-model="userConfig.value" placeholder="请输入用户配置值" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.close') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.save') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getUserConfigPage,
  createUserConfig,
  updateUserConfig,
  deleteUserConfig,
  exportUserConfigExcel
} from '@/api/setting/user-config'
import {
  getKeyList
} from '@/api/setting/config'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserConfig',
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
        userId: null,
        configId: null,
        queryKey: null,
        queryUsername: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      userConfig: {
        id: null,
        userId: null,
        configId: null,
        value: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: 'table.add',
        update: 'table.edit'
      },
      rules: {
        userId: [{ required: true, message: '请输入用户主键', trigger: 'change' }],
        configId: [{ required: true, message: '请输入配置主键', trigger: 'change' }],
        value: [{ required: true, message: '请输入用户配置值', trigger: 'change' }]
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
      getUserConfigPage(this.page, this.listQuery).then(res => {
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
    handleCreate() {
      this.userConfig = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUserConfig(this.userConfig).then((res) => {
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
      this.userConfig = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUserConfig(this.userConfig).then((res) => {
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
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserConfig(row.id).then(res => {
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
    getKeyList(key, callback) {
      getKeyList(key, 1).then(res => {
        const keyList = []
        for (const k of res.data) {
          const keyObj = { value: k }
          keyList.push(keyObj)
        }
        callback(keyList)
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
      exportUserConfigExcel(this.listQuery, '数据列表')
    }
  }
}
</script>
<style scoped>

</style>
