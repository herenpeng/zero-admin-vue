<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="$t('table.data.role.name')" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.description" :placeholder="$t('table.data.role.description')" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.acquiescence" :placeholder="$t('table.data.role.acquiescence')" style="width: 150px;margin-right: 10px;"
                 clearable class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="true" :label="$t('common.true')" />
        <el-option value="false" :label="$t('common.false')" />
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
      <el-table-column :label="$t('table.id')" type="index" sortable="true" align="center" width="80" />
      <el-table-column :label="$t('table.data.role.name')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.role.description')" align="center">
        <template v-slot="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.role.acquiescence')" width="200px" align="center">
        <template v-slot="{row}">
          <el-switch
            v-model="row.acquiescence"
            :active-text="$t('common.true')"
            :inactive-text="$t('common.false')"
            @change="setAcquiescence(row.id, row.acquiescence)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="220px" class-name="small-padding fixed-width" fixed="right">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteData(row)">
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
      <el-form ref="dataForm" :rules="rules" :model="role" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.data.role.name')" prop="name">
          <el-input v-model="role.name" :placeholder="$t('table.data.role.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.role.description')" prop="description">
          <el-input v-model="role.description" type="textarea" :placeholder="$t('table.data.role.descriptionPlaceholder')" />
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
  getRolePage,
  createRole,
  updateRole,
  deleteRole,
  checkName,
  exportRoleExcel,
  setAcquiescence
} from '@/api/data/role'
import Pagination from '@/components/Pagination'
import { checkUsername } from '@/api/data/user'

export default {
  name: 'Role',
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
        name: null,
        description: null,
        acquiescence: null
      },
      role: {
        id: null,
        name: null,
        description: null,
        acquiescence: false
      },
      oldRoleName: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: 'table.add',
        update: 'table.edit'
      },
      roleList: [],
      downloadLoading: false
    }
  },
  computed: {
    rules() {
      return {
        name: [
          { required: true, message: this.$t('table.data.role.nameRule'), trigger: 'change' },
          { validator: (rule, value, callback) => {
            if (value === this.oldRoleName && this.dialogStatus === 'update') {
              callback()
            } else {
              checkName(value).then(res => {
                if (res.data) {
                  callback(new Error(this.$t('table.data.role.roleExists')))
                } else {
                  callback()
                }
              })
            }
          }, trigger: 'change' }
        ],
        description: [{ required: true, message: this.$t('table.data.role.descriptionRule'), trigger: 'change' }]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getRolePage(this.page, this.listQuery).then(res => {
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
      this.role = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRole(this.role).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t(res.message),
              type: 'success',
              duration: 2000
            })
            this.loadData()
          })
        }
      })
    },
    handleUpdate(row) {
      this.role = Object.assign({}, row)
      this.oldRoleName = this.role.name
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateRole(this.role).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t(res.message),
              type: 'success',
              duration: 2000
            })
            this.loadData()
          })
        }
      })
    },
    setAcquiescence(id, acquiescence) {
      setAcquiescence(id, acquiescence).then((res) => {
        this.$notify({
          title: this.$t('common.success'),
          message: this.$t(res.message),
          type: 'success',
          duration: 2000
        })
        this.loadData()
      })
    },
    deleteData(row) {
      this.$confirm(this.$t('table.data.role.deleteTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(res => {
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
      exportRoleExcel(this.listQuery, '角色列表')
    }
  }
}
</script>
<style scoped>

</style>
