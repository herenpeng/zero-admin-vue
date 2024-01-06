<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-tree :data="organTree" :props="organTreeProps" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-input v-model="listQuery.name" placeholder="组织机构名称" style="width: 200px;" class="filter-item"
                    @keyup.enter.native="handleFilter"
          />
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
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @sort-change="sortChange"
        >
          <el-table-column label="序号" sortable="true" align="center" width="80" />
          <el-table-column label="组织机构名称" width="150px" align="center">
            <template v-slot="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="组织机构排序" width="150px" align="center">
            <template v-slot="{row}">
              <span>{{ row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="300px">
            <template v-slot="{row}">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
                编辑
              </el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteData(row)">
                删除
              </el-button>
              <el-button size="mini" type="warning" icon="el-icon-circle-plus-outline" @click="handleCreate(row)" />
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
          <el-form ref="dataForm" :rules="rules" :model="organ" label-position="left" label-width="120px"
                   style="width: 400px; margin-left:50px;"
          >
            <el-form-item label="组织机构名称" prop="name">
              <el-input v-model="organ.name" placeholder="请输入组织机构名称" />
            </el-form-item>
            <el-form-item label="组织机构排序" prop="sort">
              <el-input v-model="organ.sort" type="number" placeholder="请输入组织机构排序" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">关闭</el-button>
            <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
          </div>
        </el-dialog>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import {
  getOrganPage,
  createOrgan,
  updateOrgan,
  deleteOrgan,
  exportOrganExcel
} from '@/api/data/organ'
import Pagination from '@/components/Pagination'

export default {
  name: 'Organ',
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
        name: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      organ: {
        id: null,
        name: null,
        sort: null,
        parentId: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '添加',
        update: '编辑'
      },
      rules: {
        name: [{ required: true, message: '请输入组织机构名称', trigger: 'change' }],
        sort: [{ required: true, message: '请输入组织机构排序', trigger: 'change' }],
        parentId: [{ required: true, message: '请输入父级组织机构主键，如果为顶级组织机构，值为0', trigger: 'change' }]
      },
      downloadLoading: false,
      organTree: [],
      organTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getOrganPage(this.page, this.listQuery).then(res => {
        setTimeout(() => {
          if (this.listLoading === true) {
            this.listLoading = false
          }
        }, 1000)
        const page = res.data
        this.list = page.records
        this.page.total = page.total
        this.listLoading = false
        this.buildTree()
      })
    },
    buildTree() {
      this.organTree = []
      for (const organ of this.list) {
        const node = JSON.parse(JSON.stringify(organ))
        this.organTree.push(node)
        this.buildChildrenTree(node)
      }
    },
    buildChildrenTree(organ) {
      // 先寻找子组织，否则将用户加入子组织后，循环迭代会有问题
      for (const node of organ.children) {
        this.buildChildrenTree(node)
      }
      for (const user of organ.users) {
        organ.children.push({ id: user.id, name: user.username, isUser: true })
      }
    },
    handlePagination(page) {
      this.page.currentPage = page.page
      this.page.size = page.limit
      this.loadData()
    },
    handleCreate(row) {
      this.organ = { parentId: row !== null ? row.id : 0 }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createOrgan(this.organ).then((res) => {
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
      this.organ = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateOrgan(this.organ).then((res) => {
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
        deleteOrgan(row.id).then(res => {
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
      exportOrganExcel(this.listQuery, '数据列表')
    },
    handleNodeClick() {

    }
  }
}
</script>
<style scoped>

</style>
