<template>
  <div class="app-container">
    <div class="filter-container">
      <el-autocomplete
        v-model="listQuery.key"
        :fetch-suggestions="getKeyList"
        placeholder="常量键值"
        clearable
        @select="handleFilter"
      />
      <el-input v-model="listQuery.description" placeholder="键值描述信息" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.userable" placeholder="用户是否可配置" clearable class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="true" label="是" />
        <el-option value="false" label="否" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate"
      >
        添加
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
      <el-table-column label="常量键值" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="键值描述信息" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统配置的默认值" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.defaultValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户是否可配置" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userable | userableFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteData(row)">
            删除
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="configConst" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="常量键值" prop="key">
          <el-input v-model="configConst.key" placeholder="请输入常量键值" />
        </el-form-item>
        <el-form-item label="键值描述信息" prop="description">
          <el-input v-model="configConst.description" placeholder="请输入键值描述信息" />
        </el-form-item>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input v-model="configConst.defaultValue" placeholder="请输入默认值" />
        </el-form-item>
        <el-form-item label="用户是否可配置" prop="userable">
          <el-switch
            v-model="configConst.userable"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
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
} from '@/api/system/config'
import Pagination from '@/components/Pagination'

export default {
  name: 'ConfigConst',
  components: { Pagination },
  filters: {
    userableFilter(ableValue) {
      if (ableValue) {
        return '是'
      } else {
        return '否'
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
        key: null,
        description: null,
        userable: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      configConst: {
        id: null,
        key: null,
        description: null,
        defaultValue: null,
        userable: false
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '添加',
        update: '编辑'
      },
      rules: {
        key: [{ required: true, message: '请输入常量键值，标识，唯一', trigger: 'change' }],
        description: [{ required: true, message: '请输入键值描述信息', trigger: 'change' }],
        defaultValue: [{ required: true, message: '请输入系统配置的默认值', trigger: 'change' }],
        userable: [{ required: true, message: '请输入用户可配置，true为可配置，false为不可配置', trigger: 'change' }]
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
          message: '已取消删除'
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
      exportConfigConstExcel(this.listQuery, '数据列表')
    }
  }
}
</script>
<style scoped>

</style>
