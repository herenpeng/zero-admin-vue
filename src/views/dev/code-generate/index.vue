<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="$t('table.dev.codeGenerate.name')" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.comment" :placeholder="$t('table.dev.codeGenerate.comment')" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.entityName" :placeholder="$t('table.dev.codeGenerate.entityName')" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.javaPackage" :placeholder="$t('table.dev.codeGenerate.javaPackage')" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.codeAuthor" :placeholder="$t('table.dev.codeGenerate.codeAuthor')" style="width: 150px;margin-right: 10px;"
                class="filter-item"
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
      highlight-current-row
      size="mini"
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.id')" type="index" sortable="true" align="center" width="60" />
      <el-table-column :label="$t('table.dev.codeGenerate.name')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.comment')" width="160px" align="center">
        <template v-slot="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.entityName')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.entityName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.javaCodePath')" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.javaCodePath }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.requestMapping')" width="90px" align="center">
        <template v-slot="{row}">
          <span>{{ row.requestMapping }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.javaPackage')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.javaPackage }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.vueCodePath')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.vueCodePath }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.vuePackage')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.vuePackage }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.tree')" width="80px" align="center">
        <template v-slot="{row}">
          <span>{{ row.tree ? $t('common.true') : $t('common.false') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.cover')" width="80px" align="center">
        <template v-slot="{row}">
          <span>{{ row.cover ? $t('common.true') : $t('common.false') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.codeAuthor')" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.codeAuthor }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width" width="350px" fixed="right">
        <template v-slot="{row}">
          <router-link :to="{path:'/dev/code-setting',query: {id: row.id}}" style="margin-right: 10px">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              {{ $t('table.edit') }}
            </el-button>
          </router-link>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteData(row)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button icon="el-icon-refresh-right" size="mini" type="success" @click="codeGenerate(row)">
            {{ $t('table.codeGenerate') }}
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
      <el-form ref="dataForm" :rules="rules" :model="tableInfo" label-position="left" label-width="150px"
               style="width: 500px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.dev.codeGenerate.name')" prop="name">
          <el-select v-model="tableInfo.name" :placeholder="$t('table.dev.codeGenerate.namePlaceholder')" clearable style="width: 280px;"
                     class="filter-item" :disabled="dialogStatus==='update'" @change="handleTableName"
          >
            <el-option v-for="(tableInfo,index) in tableInfoList" :key="index" :value="tableInfo"
                       :label="tableInfo.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.comment')" prop="comment">
          <el-input v-model="tableInfo.comment" :placeholder="$t('table.dev.codeGenerate.commentPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.entityName')" prop="entityName">
          <el-input v-model="tableInfo.entityName" :placeholder="$t('table.dev.codeGenerate.entityNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.javaCodePath')" prop="javaCodePath">
          <el-autocomplete
            v-model="tableInfo.javaCodePath"
            class="inline-input"
            :fetch-suggestions="(querySearch, cb) => {
              return cb([{ 'value': 'F:\\IdeaCode\\zero-admin\\zero-sys' }])
            }"
            placeholder="F:\IdeaCode\zero-admin\zero-sys"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.requestMapping')" prop="requestMapping">
          <el-input v-model="tableInfo.requestMapping" :placeholder="$t('table.dev.codeGenerate.requestMappingPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.javaPackage')" prop="javaPackage">
          <el-input v-model="tableInfo.javaPackage" placeholder="com.zero.sys" />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.vueCodePath')" prop="vueCodePath">
          <el-autocomplete
            v-model="tableInfo.vueCodePath"
            class="inline-input"
            :fetch-suggestions="(querySearch, cb) => {
              return cb([{ 'value': 'F:\\Js\\zero-admin-vue' }])
            }"
            placeholder="F:\Js\zero-admin-vue"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.vuePackage')" prop="vuePackage">
          <el-input v-model="tableInfo.vuePackage" placeholder="data.user" />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.tree')">
          <el-switch
            v-model="tableInfo.tree"
            :active-text="$t('common.true')"
            :inactive-text="$t('common.false')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.cover')">
          <el-switch
            v-model="tableInfo.cover"
            :active-text="$t('common.true')"
            :inactive-text="$t('common.false')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.codeAuthor')" prop="codeAuthor">
          <el-input v-model="tableInfo.codeAuthor" :placeholder="$t('table.dev.codeGenerate.codeAuthorPlaceholder')" disabled="disabled" />
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
import { mapGetters } from 'vuex'
import {
  getTableInfoPage,
  getNotAddList,
  createTableInfo,
  deleteTableInfo,
  codeGenerate
} from '@/api/dev/code-generate'
import Pagination from '@/components/Pagination'

export default {
  name: 'CodeGenerate',
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
        javaCodePath: null,
        requestMapping: null,
        javaPackage: null,
        vueCodePath: null,
        vuePackage: null,
        tree: false,
        cover: false,
        codeAuthor: null
      },
      tableInfoList: [],
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
    ...mapGetters([
      'username'
    ]),
    rules() {
      return {
        name: [{ required: true, message: this.$t('table.dev.codeGenerate.nameRule'), trigger: 'change' }],
        comment: [{ required: true, message: this.$t('table.dev.codeGenerate.commentRule'), trigger: 'change' }],
        entityName: [{ required: true, message: this.$t('table.dev.codeGenerate.entityNameRule'), trigger: 'change' }],
        requestMapping: [{ required: true, message: this.$t('table.dev.codeGenerate.requestMappingRule'), trigger: 'change' }],
        javaPackage: [{ required: true, message: this.$t('table.dev.codeGenerate.javaPackageRule'), trigger: 'change' }],
        javaCodePath: [{ required: true, message: this.$t('table.dev.codeGenerate.javaCodePathRule'), trigger: 'change' }],
        vueCodePath: [{ required: true, message: this.$t('table.dev.codeGenerate.vueCodePathRule'), trigger: 'change' }],
        vuePackage: [{ required: true, message: this.$t('table.dev.codeGenerate.vuePackageRule'), trigger: 'change' }]
      }
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
      this.$confirm(this.$t('table.dev.codeGenerate.deleteTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
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
          message: this.$t('common.cancelDelete')
        })
      })
    },
    handleFilter() {
      this.page.currentPage = 1
      this.loadData()
    },
    codeGenerate(row) {
      this.$confirm(this.$t('table.dev.codeGenerate.codeGenerateTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        codeGenerate(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('common.cancelOperation')
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
