<template>
  <div>
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-refresh" @click="synchron">
        {{ $t('table.synchron') }}
      </el-button>
      <router-link :to="{path:'/dev/code-generate'}" style="margin-left: 10px">
        <el-button type="success" icon="el-icon-back">{{ $t('table.back') }}</el-button>
      </router-link>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      size="mini"
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.id')" type="index" sortable="true" align="center" width="80" />
      <el-table-column :label="$t('table.dev.codeGenerate.columnName')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.databaseType')" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.databaseType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.javaName')" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.javaName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.javaType')" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.javaType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.jdbcType')" width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ row.jdbcType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.columnComment')" align="center">
        <template v-slot="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.query')" width="130px" align="center">
        <template v-slot="{row}">
          <span>{{ row.query ? $t('common.true') : $t('common.false') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dev.codeGenerate.sort')" width="90px" align="center">
        <template v-slot="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width" width="100px">
        <template v-slot="{row}">
          <el-button v-if="baseColumnArray.indexOf(row.name) === -1" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdateTableColumn(row)">
            {{ $t('table.edit') }}
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
      <el-form ref="dataForm" :rules="rules" :model="tableColumn" label-position="left" label-width="150px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.dev.codeGenerate.columnName')" prop="name">
          <el-input v-model="tableColumn.name" :placeholder="$t('table.dev.codeGenerate.columnNamePlaceholder')" disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.databaseType')" prop="databaseType">
          <el-input v-model="tableColumn.databaseType" :placeholder="$t('table.dev.codeGenerate.databaseTypePlaceholder')" disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.javaName')" prop="javaName">
          <el-input v-model="tableColumn.javaName" :placeholder="$t('table.dev.codeGenerate.javaNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.javaType')" prop="javaType">
          <el-select v-model="tableColumn.javaType" :placeholder="$t('table.dev.codeGenerate.javaTypePlaceholder')" clearable class="filter-item"
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
        <el-form-item :label="$t('table.dev.codeGenerate.jdbcType')" prop="jdbcType">
          <el-select v-model="tableColumn.jdbcType" :placeholder="$t('table.dev.codeGenerate.jdbcTypePlaceholder')" clearable class="filter-item"
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
        <el-form-item :label="$t('table.dev.codeGenerate.columnComment')" prop="comment">
          <el-input v-model="tableColumn.comment" :placeholder="$t('table.dev.codeGenerate.columnCommentPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.query')" prop="query">
          <el-switch
            v-model="tableColumn.query"
            :active-text="$t('common.true')"
            :inactive-text="$t('common.false')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.dev.codeGenerate.sort')" prop="sort">
          <el-input v-model="tableColumn.sort" :placeholder="$t('table.dev.codeGenerate.sortPlaceholder')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.close') }}</el-button>
        <el-button type="primary" @click="updateTableColumn()">{{ $t('table.save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getTableColumnPage, updateTableColumn, synchronTableColumn } from '@/api/dev/code-setting'

export default {
  name: 'TableColumn',
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
        create: 'table.add',
        update: 'table.edit'
      },
      baseColumnArray: ['id', 'create_time', 'create_user_id', 'update_time', 'update_user_id', 'deleted']
    }
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: this.$t('table.dev.codeGenerate.columnNameRule'), trigger: 'change' }],
        databaseType: [{ required: true, message: this.$t('table.dev.codeGenerate.databaseTypeRule'), trigger: 'change' }],
        javaName: [{ required: true, message: this.$t('table.dev.codeGenerate.javaNameRule'), trigger: 'change' }],
        javaType: [{ required: true, message: this.$t('table.dev.codeGenerate.javaTypeRule'), trigger: 'change' }],
        jdbcType: [{ required: true, message: this.$t('table.dev.codeGenerate.jdbcTypeRule'), trigger: 'change' }],
        comment: [{ required: true, message: this.$t('table.dev.codeGenerate.columnCommentRule'), trigger: 'change' }],
        sort: [{ required: true, message: this.$t('table.dev.codeGenerate.sortRule'), trigger: 'change' }]
      }
    }
  },
  watch: {
    '$route.query.id'(newValue, oldValue) {
      this.getTableColumnPage()
    }
  },
  created() {
    this.getTableColumnPage()
  },
  methods: {
    getTableColumnPage() {
      this.listLoading = true
      const tableInfoId = this.$route.query.id
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
              title: this.$t('common.success'),
              message: this.$t(res.message),
              type: 'success',
              duration: 2000
            })
            this.getTableColumnPage()
          })
        }
      })
    },
    synchron() {
      this.listLoading = true
      const tableInfoId = this.$route.query.id
      synchronTableColumn(tableInfoId).then(res => {
        setTimeout(() => {
          if (this.listLoading === true) {
            this.listLoading = false
          }
        }, 1000)
        this.listLoading = false
        this.getTableColumnPage()
      })
    }
  }
}
</script>

<style scoped>

</style>
