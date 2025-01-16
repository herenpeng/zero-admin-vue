<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="$t('table.data.fileManage.name')" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.type" :placeholder="$t('table.data.fileManage.type')" clearable style="width: 120px" class="filter-item"
                 @change="handleFilter"
      >
        <el-option value="IMAGE" :label="$t('table.data.fileManage.image')" />
        <el-option value="PDF" :label="$t('table.data.fileManage.pdf')" />
      </el-select>
      <el-input v-model="listQuery.queryUsername" :placeholder="$t('table.data.fileManage.username')" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="queryDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="~"
        :start-placeholder="$t('table.startTime')"
        :end-placeholder="$t('table.endTime')"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
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
      row-key="id"
      border
      fit
      size="mini"
      style="width: 100%;"
      :tree-props="{children: 'bakFiles', hasChildren: 'hasChildren'}"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.id')" type="index" sortable="true" align="center" width="80px" />
      <el-table-column :label="$t('table.data.fileManage.name')">
        <template v-slot="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.fileManage.type')" width="110px">
        <template v-slot="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.fileManage.uploadTime')" width="200">
        <template v-slot="{row}">
          <span>{{ row.uploadTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.fileManage.username')" width="135px">
        <template v-slot="{row}">
          <span>{{ row.user.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.data.fileManage.view')" width="120px" align="center">
        <template v-slot="{row}">
          <span><el-link type="success" style="font-size: 12px;" @click="view(row)">{{ $t('table.data.fileManage.view') }}</el-link></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" width="360" class-name="small-padding fixed-width" fixed="right">
        <template v-slot="{row}">
          <el-button v-if="row.parentId === 0" type="success" size="mini" icon="el-icon-document-copy"
                     @click="bakData(row)"
          >
            {{ $t('table.backups') }}
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-sort" @click="handleUpdate(row)">
            {{ $t('table.replace') }}
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

    <el-dialog :title="$t(textMap[dialogStatus])" :visible.sync="dialogFormVisible" width="60%">
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        :limit="1"
        fit="scale-down"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-change="handlerChange"
        :on-exceed="handleExceed"
      >
        <i class="el-icon-plus" />
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.close') }}</el-button>
        <el-button style="margin-top: 10px;" type="primary" @click="replaceFile">{{ $t('table.replace') }}</el-button>
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
  bakFileManage,
  replaceFile,
  deleteFileManage,
  exportFileManageExcel
} from '@/api/data/file-manage'

export default {
  name: 'FileManage',
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
      queryDate: null,
      listQuery: {
        name: null,
        type: null,
        queryUsername: null,
        queryStartDate: null,
        queryEndDate: null
      },
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: 'table.add',
        update: 'table.replace'
      },
      downloadLoading: false,
      dialogVisible: false,
      dialogImageUrl: null,
      file: null
    }
  },
  computed: {
    pickerOptions() {
      return {
        shortcuts: [{
          text: this.$t('date.lastWeek'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('date.lastMonth'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('date.lastThreeMonths'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
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
    handleUpdate(row) {
      // 复制一个新的对象
      this.fileManage = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    bakData(row) {
      this.$confirm(this.$t('table.data.fileManage.bakTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
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
          message: this.$t('table.data.fileManage.cancelBak')
        })
      })
    },
    deleteData(row) {
      this.$confirm(this.$t('table.data.fileManage.deleteTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
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
          message: this.$t('common.cancelDelete')
        })
      })
    },
    view(row) {
      this.dialogVisible = true
      // 在图片请求的末尾加上一个随机的时间戳，用于防止浏览器使用图片缓存导致图片无法及时刷新
      this.dialogImageUrl = row.uri + '?' + Math.random()
    },
    handleFilter() {
      this.page.currentPage = 1
      this.loadData()
    },
    replaceFile() {
      if (this.file === null) {
        this.$message({
          type: 'info',
          message: this.$t('table.data.fileManage.replaceFile')
        })
        return
      }
      this.$confirm(this.$t('table.data.fileManage.replaceFileTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('table.data.fileManage.confirmReplace'),
        cancelButtonText: this.$t('table.data.fileManage.cancelReplace'),
        type: 'warning'
      }).then(() => {
        replaceFile(this.fileManage.id, this.file).then(async(res) => {
          this.dialogFormVisible = false
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('table.data.fileManage.replaceSuccess'),
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('table.data.fileManage.cancel')
        })
      })
    },
    handlerChange(file, fileList) {
      this.file = file.raw
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file) {
      this.file = null
    },
    handleExceed(files, fileList) {
      this.$message({
        type: 'info',
        message: '只允许上传一个文件'
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
      exportFileManageExcel(this.listQuery, '文件管理列表')
    }
  }
}
</script>
