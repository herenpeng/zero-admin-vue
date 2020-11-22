<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.metaTitle" placeholder="菜单名称" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.path" placeholder="菜单路由路径" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.name" placeholder="菜单模块名称" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-input v-model="listQuery.component" placeholder="菜单模块路径" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.enabled" placeholder="是否启用" clearable style="width: 120px" class="filter-item"
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
      style="width: 100%;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" sortable="true" align="center" width="80" />
      <el-table-column label="菜单名称" width="120">
        <template slot-scope="{row}">
          <span :style="{'font-weight': row.parentId == 0 ? 'bolder' : ''}">
            <i v-if="row.parentId != 0" class="el-icon-map-location" />
            {{ row.metaTitle }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="菜单路由路径" width="110">
        <template slot-scope="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单模块名称" width="110">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单模块路径" width="150">
        <template slot-scope="{row}">
          <span>{{ row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.enabled | enabledFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单排序" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单角色" class-name="status-col" width="280px">
        <template slot-scope="{row}">
          <el-tag
            v-for="(role,index) in row.roles"
            :key="index"
            closable
            :type="tagType[role.id]"
            style="margin-right: 5px;border-radius: 15px;"
            :title="role.description"
            @close="deleteMenuRole(row.id, role.id)"
          >
            {{ role.name }}
          </el-tag>
          <el-dropdown trigger="click" @command="addMenuRole(row.id, $event)">
            <el-button style="border-radius: 20px;" size="small" @click="getMenuNotRoleList(row.id)">+</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(role,index) in roleList"
                :key="index"
                :title="role.description"
                :command="role.id"
              >{{ role.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="menu" label-position="left" label-width="160px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="菜单路由路径" prop="path">
          <el-input v-model="menu.path" placeholder="请输入菜单路由路径" />
        </el-form-item>
        <el-form-item label="菜单模块名称" prop="name">
          <el-input v-model="menu.name" placeholder="请输入菜单模块名称" />
        </el-form-item>
        <el-form-item label="菜单模块路径" prop="component">
          <el-input v-model="menu.component" placeholder="请输入菜单模块路径" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="metaTitle">
          <el-input v-model="menu.metaTitle" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="metaIcon">
          <el-input v-model="menu.metaIcon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="父级菜单定向路由路径" prop="redirect">
          <el-input v-model="menu.redirect" placeholder="请输入父级菜单定向路由路径" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input v-model="menu.sort" placeholder="请输入菜单排序" />
        </el-form-item>
        <el-form-item label="是否启用" prop="hidden">
          <el-switch
            v-model="menu.enabled"
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

  </div>
</template>
<script>
import Pagination from '@/components/Pagination/index'
import { getMenuPage, createMenu, enabled, deleteMenu, deleteMenuRole, updateUser, getMenuNotRoleList, addMenuRole } from '@/api/data/menu'

export default {
  name: 'Menu',
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
        size: 8,
        total: 0
      },
      listLoading: false,
      listQuery: {
        path: null,
        name: null,
        component: null,
        metaTitle: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      menu: {
        path: null,
        name: null,
        component: null,
        metaTitle: null,
        metaIcon: null,
        redirect: null,
        hidden: false,
        sort: null,
        parentId: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '添加',
        update: '编辑'
      },
      roleList: [],
      rules: {
        path: [{ required: true, message: '请输入菜单路由路径', trigger: 'change' }],
        component: [{ required: true, message: '请输入菜单模块路径', trigger: 'change' }],
        sort: [{ required: true, message: '请输入菜单排序', trigger: 'change' }],
        hidden: [{ required: true, message: '请选择菜单是否隐藏', trigger: 'change' }]
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
      getMenuPage(this.page, this.listQuery).then(res => {
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
    enabled(row, value) {
      enabled(row.id, value).then(res => {
        row.enabled = value
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createMenu(this.menu).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.menu = null
            this.loadData()
          })
        }
      })
    },
    handleUpdate(row) {
      this.user = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUser(this.user).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.user = null
            this.loadData()
          })
        }
      })
    },
    deleteData(row, index) {
      this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(res => {
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
    deleteMenuRole(menuId, roleId) {
      deleteMenuRole(menuId, roleId).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.loadData()
      })
    },
    getMenuNotRoleList(id) {
      getMenuNotRoleList(id).then(res => {
        const list = res.data
        if (list.length === 0) {
          this.roleList = null
          this.$message({
            type: 'warning',
            message: '所有角色均已拥有该菜单，无法添加'
          })
        } else {
          this.roleList = list
        }
      })
    },
    addMenuRole(menuId, roleId) {
      addMenuRole(menuId, roleId).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.loadData()
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