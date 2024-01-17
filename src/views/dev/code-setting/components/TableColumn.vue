<template>
  <div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      size="mini"
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" sortable="true" align="center" width="80" />
      <el-table-column label="字段名称" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段类型" width="110px" align="center">
        <template v-slot="{row}">
          <span>{{ row.databaseType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Java属性" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.javaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Jave类型" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.javaType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="JDBC类型" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.jdbcType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段注释" align="center">
        <template v-slot="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否为查询字段" width="80px" align="center">
        <template v-slot="{row}">
          <span>{{ row.query | queryFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段排序顺序" width="80px" align="center">
        <template v-slot="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100px">
        <template v-slot="{row}">
          <el-button v-if="baseColumn(row.name)" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdateTableColumn(row)">
            编辑
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
      <el-form ref="dataForm" :rules="rules" :model="tableColumn" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="字段名称" prop="name">
          <el-input v-model="tableColumn.name" placeholder="请输入字段名称" disabled="disabled" />
        </el-form-item>
        <el-form-item label="字段类型" prop="databaseType">
          <el-input v-model="tableColumn.databaseType" placeholder="请输入字段类型" disabled="disabled" />
        </el-form-item>
        <el-form-item label="Java属性" prop="javaName">
          <el-input v-model="tableColumn.javaName" placeholder="请输入Java属性" />
        </el-form-item>
        <el-form-item label="Java类型" prop="javaType">
          <el-select v-model="tableColumn.javaType" placeholder="请输入Java类型" clearable class="filter-item"
                     style="width: 280px"
          >
            <el-option value="Integer" label="Integer" />
            <el-option value="Long" label="Long" />
            <el-option value="String" label="String" />
            <el-option value="Date" label="Date" />
            <el-option value="Boolean" label="Boolean" />
            <el-option value="BigDecimal" label="BigDecimal" />
            <el-option value="Double" label="Double" />
          </el-select>
        </el-form-item>
        <el-form-item label="JDBC类型" prop="jdbcType">
          <el-select v-model="tableColumn.jdbcType" placeholder="请输入JDBC类型" clearable class="filter-item"
                     style="width: 280px"
          >
            <el-option value="INTEGER" label="INTEGER" />
            <el-option value="BIGINT" label="BIGINT" />
            <el-option value="CHAR" label="CHAR" />
            <el-option value="VARCHAR" label="VARCHAR" />
            <el-option value="TIMESTAMP" label="TIMESTAMP" />
            <el-option value="DATE" label="DATE" />
            <el-option value="TIME" label="TIME" />
            <el-option value="BOOLEAN" label="BOOLEAN" />
            <el-option value="DECIMAL" label="DECIMAL" />
            <el-option value="NUMERIC" label="NUMERIC" />
            <el-option value="FLOAT" label="FLOAT" />
            <el-option value="DOUBLE" label="DOUBLE" />
          </el-select>
        </el-form-item>
        <el-form-item label="字段注释" prop="comment">
          <el-input v-model="tableColumn.comment" placeholder="请输入字段注释" />
        </el-form-item>
        <el-form-item label="是否为查询字段" prop="query">
          <el-switch
            v-model="tableColumn.query"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item label="字段排序顺序" prop="sort">
          <el-input v-model="tableColumn.sort" placeholder="请输入字段排序顺序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="updateTableColumn()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getTableColumnPage, updateTableColumn } from '@/api/dev/code-setting'

export default {
  name: 'TableColumn',
  components: { Pagination },
  props: {
    tableInfoId: {
      type: Number,
      default: null
    }
  },
  filters: {
    queryFilter(queryValue) {
      if (queryValue) {
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
      tableColumn: {
        id: null,
        name: null,
        databaseType: null,
        javaName: null,
        javaType: null,
        jdbcType: null,
        query: false,
        comment: null,
        sort: null
      },
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '添加',
        update: '编辑'
      },
      rules: {
        name: [{ required: true, message: '请输入字段名称', trigger: 'change' }],
        databaseType: [{ required: true, message: '请输入字段类型', trigger: 'change' }],
        javaName: [{ required: true, message: '请输入Java属性', trigger: 'change' }],
        javaType: [{ required: true, message: '请输入Java类型', trigger: 'change' }],
        jdbcType: [{ required: true, message: '请输入JDBC类型', trigger: 'change' }],
        comment: [{ required: true, message: '请输入字段注释', trigger: 'change' }],
        query: [{ required: true, message: '请输入选择是否为查询字段', trigger: 'change' }],
        sort: [{ required: true, message: '请输入字段排序顺序', trigger: 'change' }]
      },
      baseColumnArray: ['id', 'create_time', 'create_user_id', 'update_time', 'update_user_id', 'deleted']
    }
  },
  watch: {
    tableInfoId: function() {
      this.getTableColumnPage()
    }
  },
  methods: {
    getTableColumnPage() {
      this.listLoading = true
      const tableInfoId = this.tableInfoId
      getTableColumnPage(this.page, { tableInfoId }).then(res => {
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
      this.getTableColumnPage()
    },
    handleUpdateTableColumn(row) {
      this.tableColumn = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateTableColumn() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateTableColumn(this.tableColumn).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.getTableColumnPage()
          })
        }
      })
    },
    baseColumn(name) {
      // 如果是基础字段，不允许编辑修改
      if (this.baseColumnArray.indexOf(name) !== -1) {
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
