<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-form ref="dataForm" :rules="rules" :model="quartzJob" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.data.quartzJob.name')" prop="name">
          <el-input v-model="quartzJob.name" :placeholder="$t('table.data.quartzJob.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.quartzJob.groupName')" prop="groupName">
          <el-input v-model="quartzJob.groupName" :placeholder="$t('table.data.quartzJob.groupNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.quartzJob.status')" prop="status">
          <el-switch
                v-model="quartzJob.status"
                style="width: 190px"
                :active-text="$t('common.true')"
                :inactive-text="$t('common.false')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.data.quartzJob.expression')" prop="expression">
          <el-input v-model="quartzJob.expression" :placeholder="$t('table.data.quartzJob.expressionPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.quartzJob.description')" prop="description">
          <el-input v-model="quartzJob.description" :placeholder="$t('table.data.quartzJob.descriptionPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.quartzJob.concurrent')" prop="concurrent">
          <el-switch
                v-model="quartzJob.concurrent"
                style="width: 190px"
                :active-text="$t('common.true')"
                :inactive-text="$t('common.false')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.data.quartzJob.beanClass')" prop="beanClass">
          <el-input v-model="quartzJob.beanClass" :placeholder="$t('table.data.quartzJob.beanClassPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.quartzJob.method')" prop="method">
          <el-input v-model="quartzJob.method" :placeholder="$t('table.data.quartzJob.methodPlaceholder')" />
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
  getQuartzJobPage,
  createQuartzJob,
  updateQuartzJob,
  deleteQuartzJob,
  exportQuartzJobExcel
} from '@/api/data/quartz-job'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'QuartzJob',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      listLoading: false,
      listQuery: {
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      quartzJob: {
        id: null,
        name: null,
        groupName: null,
        status: null,
        expression: null,
        description: null,
        concurrent: null,
        beanClass: null,
        method: null,
        previousFireTime: null,
        nextFireTime: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: 'table.add',
        update: 'table.edit'
      },
      downloadLoading: false,
    }
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: this.$t('table.data.quartzJob.nameRule'), trigger: 'change' }],
        groupName: [{ required: true, message: this.$t('table.data.quartzJob.groupNameRule'), trigger: 'change' }],
        status: [{ required: true, message: this.$t('table.data.quartzJob.statusRule'), trigger: 'change' }],
        expression: [{ required: true, message: this.$t('table.data.quartzJob.expressionRule'), trigger: 'change' }],
        description: [{ required: true, message: this.$t('table.data.quartzJob.descriptionRule'), trigger: 'change' }],
        concurrent: [{ required: true, message: this.$t('table.data.quartzJob.concurrentRule'), trigger: 'change' }],
        beanClass: [{ required: true, message: this.$t('table.data.quartzJob.beanClassRule'), trigger: 'change' }],
        method: [{ required: true, message: this.$t('table.data.quartzJob.methodRule'), trigger: 'change' }],
        previousFireTime: [{ required: true, message: this.$t('table.data.quartzJob.previousFireTimeRule'), trigger: 'change' }],
        nextFireTime: [{ required: true, message: this.$t('table.data.quartzJob.nextFireTimeRule'), trigger: 'change' }]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getQuartzJobPage(this.page, this.listQuery).then(res => {
        setTimeout(() => {
          if (this.listLoading === true) {
            this.listLoading = false
          }
        }, 1000)
        const page = res.data
        this.list = page.records
        this.page.total = page.total
        this.listLoading = false
        this.quartzJobTree = this.buildTree(this.list)
      })
    },
    handlePagination(page) {
      this.page.currentPage = page.page
      this.page.size = page.limit
      this.loadData()
    },
    handleCreate() {
      this.quartzJob = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createQuartzJob(this.quartzJob).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
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
      this.quartzJob = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateQuartzJob(this.quartzJob).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
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
      this.$confirm(this.$t('common.deleteTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        deleteQuartzJob(row.id).then(res => {
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
      exportQuartzJobExcel(this.listQuery, this.$t('common.exportFileName'))
    }
  }
}
</script>
<style scoped>

</style>
