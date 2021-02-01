<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="文件名称" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.type" placeholder="文件类型" clearable style="width: 120px" class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="IMAGE" label="图片" />
        <el-option value="PDF" label="PDF" />
      </el-select>
      <el-input v-model="listQuery.queryUsername" placeholder="上传用户" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="queryDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
      />
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate(null)"
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
      row-key="id"
      border
      fit
      size="mini"
      style="width: 100%;"
      :tree-props="{children: 'bakFiles', hasChildren: 'hasChildren'}"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" sortable="true" align="center" width="80" />
      <el-table-column label="文件名称" width="200">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件类型" width="80">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="150">
        <template slot-scope="{row}">
          <span>{{ row.uploadTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传用户" width="135">
        <template slot-scope="{row}">
          <span>{{ row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查看" width="70" align="center">
        <template slot-scope="{row}">
          <span><el-link type="success" @click="view(row)">查看</el-link></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" icon="el-icon-check" @click="bakData(row)" v-if="row.parentId === 0">
            备份
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.enabled === false" icon="el-icon-check" size="mini" type="success" @click="enabled(row, true)">
            启用
          </el-button>
          <el-button v-if="row.enabled === true" icon="el-icon-close" size="mini" @click="enabled(row, false)">
            禁用
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteData(row)">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="fileManage" label-position="left" label-width="180px"
               style="width: 800px; margin-left:50px;" :inline="true"
      >
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="fileManage.name" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="文件类型" prop="type">
          <el-input v-model="fileManage.type" placeholder="请输入文件类型" />
        </el-form-item>
        <el-form-item label="菜单模块名称" prop="name">
          <el-input v-model="fileManage.name" placeholder="请输入菜单模块名称" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input v-model="fileManage.sort" placeholder="请输入菜单排序" />
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-switch
            v-model="fileManage.enabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>
<script>
import Pagination from '@/components/Pagination/index'
import {
  getFileManagePage,
  createFileManage,
  updateFileManage,
  bakFileManage,
  deleteFileManage,
  exportFileManageExcel
} from '@/api/data/file-manage'

export default {
  name: 'FileManage',
  components: { Pagination },
  filters: {
    enabledFilter(enabledValue) {
      if (enabledValue) {
        return '启用'
      } else {
        return '禁用'
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
      queryDate: null,
      listQuery: {
        name: null,
        type: null,
        queryUsername: null,
        queryStartDate: null,
        queryEndDate: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      fileManage: {
        name: null,
        type: null,
        uri: null,
        path: null,
        uploadTime: null,
        uploadUserId: true,
        parentId: 0,
        user: null
      },
      roles: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '添加',
        update: '编辑'
      },
      rules: {
        // metaTitle: [{ required: true, message: '请输入菜单名称', trigger: 'change' }],
        // path: [{ required: true, message: '请输入菜单路由路径', trigger: 'change' }],
        // name: [{ required: true, message: '请输入菜单模块名称', trigger: 'change' }],
        // component: [{ required: true, message: '请输入菜单模块路径', trigger: 'change' }],
        // metaIcon: [{ required: true, message: '请输入菜单图标', trigger: 'change' }],
        // redirect: [{ required: true, message: '请输入父级菜单定向路由路径', trigger: 'change' }],
        // sort: [{ required: true, message: '请输入菜单排序', trigger: 'change' }],
        // enabled: [{ required: true, message: '请选择菜单是否启用', trigger: 'change' }]
      },
      downloadLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dialogVisible: false,
      dialogImageUrl: null
    }
  },
  watch: {
    queryDate(newValue, oldValue) {
      if (newValue === null) {
        this.listQuery.queryStartDate = null
        this.listQuery.queryEndDate = null
      } else {
        this.listQuery.queryStartDate = newValue[0]
        this.listQuery.queryEndDate = newValue[1]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getFileManagePage(this.page, this.listQuery).then(res => {
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
    handleCreate(row) {
      if (row !== null) {
        this.fileManage = {
          parentId: row.id
        }
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createFileManage(this.fileManage).then((res) => {
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
      // 复制一个新的对象
      this.fileManage = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateFileManage(this.fileManage).then((res) => {
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
    bakData(row) {
      this.$confirm('此操作将备份该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bakFileManage(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.loadData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消备份'
        })
      })
    },
    deleteData(row) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFileManage(row.id).then(res => {
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
    view(row) {
      this.dialogVisible = true
      this.dialogImageUrl = row.uri
    },
    handleFilter() {
      this.page.currentPage = 1
      this.loadData()
    },
    handleClose(done) {
      done()
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
      exportFileManageExcel(this.listQuery, '文件管理列表')
    }
  }
}
</script>

<style>
  .el-drawer__body {
    overflow: auto;
  }
</style>
