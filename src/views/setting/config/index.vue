<template>
  <div class="app-container">
    <div class="filter-container">
      <el-autocomplete
        v-model="listQuery.key"
        :fetch-suggestions="getKeyList"
        :placeholder="$t('table.setting.config.key')"
        clearable
        @select="handleFilter"
      />
      <el-input v-model="listQuery.description" :placeholder="$t('table.setting.config.description')" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.custom" :placeholder="$t('table.setting.config.custom')" clearable style="margin-right: 10px;" class="filter-item"
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
      <el-table-column :label="$t('table.setting.config.key')" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.setting.config.key')" align="center">
        <template v-slot="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.setting.config.defaultValue')" width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.defaultValue }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.setting.config.custom')" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.custom ? $t('common.true') : $t('common.false') }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="configConst" label-position="left" label-width="140px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.setting.config.key')" prop="key">
          <el-input v-model="configConst.key" :placeholder="$t('table.setting.config.keyPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.setting.config.description')" prop="description">
          <el-input v-model="configConst.description" :placeholder="$t('table.setting.config.descriptionPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.setting.config.defaultValue')" prop="defaultValue">
          <el-input v-model="configConst.defaultValue" :placeholder="$t('table.setting.config.defaultValuePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.setting.config.custom')" prop="custom">
          <el-switch
            v-model="configConst.custom"
            :active-text="$t('common.true')"
            :inactive-text="$t('common.false')"
          />
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
  getConfigConstPage,
  createConfigConst,
  updateConfigConst,
  deleteConfigConst,
  getKeyList,
  exportConfigConstExcel
} from '@/api/setting/config'
import Pagination from '@/components/Pagination'

export default {
  name: 'ConfigConst',
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
        key: null,
        description: null,
        custom: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      configConst: {
        id: null,
        key: null,
        description: null,
        defaultValue: null,
        custom: false
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: 'table.add',
        update: 'table.edit'
      },
      downloadLoading: false
    }
  },
  computed: {
    rules() {
      return {
        key: [{ required: true, message: this.$t('table.setting.config.keyRule'), trigger: 'change' }],
        description: [{ required: true, message: this.$t('table.setting.config.descriptionRule'), trigger: 'change' }],
        defaultValue: [{ required: true, message: this.$t('table.setting.config.defaultValueRule'), trigger: 'change' }],
        custom: [{ required: true, message: this.$t('table.setting.config.customRule'), trigger: 'change' }]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getConfigConstPage(this.page, this.listQuery).then(res => {
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
      this.configConst = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createConfigConst(this.configConst).then((res) => {
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
      this.configConst = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateConfigConst(this.configConst).then((res) => {
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
    deleteData(row) {
      this.$confirm(this.$t('common.deleteTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        deleteConfigConst(row.id).then(res => {
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
    getKeyList(key, callback) {
      getKeyList(key).then(res => {
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
      exportConfigConstExcel(this.listQuery, this.$t('common.exportFileName'))
    }
  }
}
</script>
<style scoped>

</style>
