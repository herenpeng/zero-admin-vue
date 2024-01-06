<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="数据库表名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.comment" placeholder="数据库表描述" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.entityName" placeholder="实体类名称" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.javaPackageName" placeholder="包前缀名称" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.codeAuthor" placeholder="代码作者" style="width: 150px;margin-right: 10px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
      />
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
      highlight-current-row
      size="mini"
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" type="index" sortable="true" align="center" width="60" />
      <el-table-column label="数据库表名称" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库表描述" width="160px" align="center">
        <template v-slot="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实体类名称" width="90px" align="center">
        <template v-slot="{row}">
          <span>{{ row.entityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类请求路径" width="90px" align="center">
        <template v-slot="{row}">
          <span>{{ row.requestMapping }}</span>
        </template>
      </el-table-column>
      <el-table-column label="包前缀名称" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.javaPackageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Java代码路径" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.javaCodePath }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Vue代码路径" align="center">
        <template v-slot="{row}">
          <span>{{ row.vueCodePath }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Vue包路径" align="center">
        <template v-slot="{row}">
          <span>{{ row.vuePackage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码作者" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.codeAuthor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300px">
        <template v-slot="{row}">
          <router-link :to="{path:'/development/code-setting',query: {id: row.id}}" style="margin-right: 10px">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteData(row)">
            删除
          </el-button>
          <el-button icon="el-icon-refresh-right" size="mini" type="success" @click="codeGeneration(row)">
            代码生成
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
      <el-form ref="dataForm" :rules="rules" :model="tableInfo" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="数据库表名称" prop="name">
          <el-select v-model="tableInfo.name" placeholder="请选择数据表名称" clearable style="width: 280px;"
                     class="filter-item" :disabled="dialogStatus==='update'" @change="handleTableName"
          >
            <el-option v-for="(tableInfo,index) in tableInfoList" :key="index" :value="tableInfo"
                       :label="tableInfo.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库表描述" prop="comment">
          <el-input v-model="tableInfo.comment" placeholder="请输入数据库表描述" />
        </el-form-item>
        <el-form-item label="实体类名称" prop="entityName">
          <el-input v-model="tableInfo.entityName" placeholder="请输入实体类名称" />
        </el-form-item>
        <el-form-item label="类请求路径" prop="entityName">
          <el-input v-model="tableInfo.requestMapping" placeholder="请输入类请求路径" />
        </el-form-item>
        <el-form-item label="包前缀名称" prop="javaPackageName">
          <el-input v-model="tableInfo.javaPackageName" placeholder="com.zero.sys" />
        </el-form-item>
        <el-form-item label="Java代码路径" prop="javaCodePath">
          <el-input v-model="tableInfo.javaCodePath" placeholder="F:\IdeaCode\zero-admin\zero-sys" />
        </el-form-item>
        <el-form-item label="Vue代码路径" prop="vueCodePath">
          <el-input v-model="tableInfo.vueCodePath" placeholder="F:\Js\zero-admin-vue" />
        </el-form-item>
        <el-form-item label="Vue包路径" prop="vuePackage">
          <el-input v-model="tableInfo.vuePackage" placeholder="data.user" />
        </el-form-item>
        <el-form-item label="代码作者" prop="codeAuthor">
          <el-input v-model="tableInfo.codeAuthor" placeholder="请输入代码作者" disabled="disabled" />
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
import { mapGetters } from 'vuex'
import {
  getTableInfoPage,
  getNotAddList,
  createTableInfo,
  deleteTableInfo,
  codeGeneration
} from '@/api/development/code-generation'
import Pagination from '@/components/Pagination'

export default {
  name: 'CodeGeneration',
  components: { Pagination },
  computed: {
    ...mapGetters([
      'username'
    ])
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
        passwordExpire: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      tableInfo: {
        id: null,
        name: null,
        comment: null,
        entityName: null,
        requestMapping: null,
        javaPackageName: null,
        javaCodePath: null,
        vueCodePath: null,
        vuePackage: null,
        codeAuthor: null
      },
      tableInfoList: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '添加',
        update: '编辑'
      },
      roleList: [],
      rules: {
        name: [{ required: true, message: '请选择数据表名称', trigger: 'change' }],
        comment: [{ required: true, message: '请输入数据库表描述', trigger: 'change' }],
        entityName: [{ required: true, message: '请输入实体类名称', trigger: 'change' }],
        requestMapping: [{ required: true, message: '请输入类请求路径', trigger: 'change' }],
        javaPackageName: [{ required: true, message: '请输入包前缀名称', trigger: 'change' }],
        javaCodePath: [{ required: true, message: '请输入Java代码路径', trigger: 'change' }],
        vueCodePath: [{ required: true, message: '请输入Vue代码路径', trigger: 'change' }],
        vuePackage: [{ required: true, message: '请输入Vue包路径', trigger: 'change' }],
        // codeAuthor: [{ required: true, message: '请输入代码作者', trigger: 'change' }]
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
      getTableInfoPage(this.page, this.listQuery).then(res => {
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
      getNotAddList().then((res) => {
        this.tableInfoList = res.data
      })
      this.tableInfo = { codeAuthor: this.username }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createTableInfo(this.tableInfo).then((res) => {
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
    handleTableName(tableInfo) {
      this.tableInfo.name = tableInfo.name
      this.tableInfo.comment = tableInfo.comment
      this.setEntityName(tableInfo.name)
    },
    setEntityName(name) {
      const entity = name.substring(name.indexOf('_') + 1)
      this.tableInfo.entityName = this.convertToCamelCase(entity)
      this.tableInfo.requestMapping = entity.replace('_', '/')
    },
    convertToCamelCase(str) {
      // 去除下划线分隔符获取单词数组
      const strArr = str.split('_')
      // 如果第一个为空，则去掉
      if (strArr[0] === '') {
        strArr.shift()
      }
      // 遍历第一个单词到最后一个单词，并转换单词首字母为答谢
      for (let i = 0, len = strArr.length; i < len; i++) {
        // 如果不为空，则转成大写
        if (strArr[i] !== '') {
          strArr[i] = strArr[i][0].toUpperCase() + strArr[i].substring(1)
        }
      }
      return strArr.join('')
    },
    deleteData(row) {
      this.$confirm('此操作将删除该表信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTableInfo(row.id).then(res => {
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
    codeGeneration(row) {
      this.$confirm('此操作将会覆盖代码生成路径下的同名文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        codeGeneration(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.message
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
