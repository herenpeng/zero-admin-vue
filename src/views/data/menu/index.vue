<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="filterText"
          :placeholder="$t('tree.filter')"
        />
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="menuTree"
          node-key="id"
          :default-expanded-keys="expandedKeys"
          :filter-node-method="filterNode"
          draggable
          @node-drop="handleDrop"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        >
          <span slot-scope="{ node }" class="custom-tree-node">
            <span><i :class="node.data.metaIcon" />{{ node.data.metaTitle }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click.stop="hidden(node.data)"
              >
                <span v-if="node.data.hidden" style="color: #67C23A">{{ $t('table.data.menu.display') }}</span>
                <span v-else style="color: #E5A13C">{{ $t('table.data.menu.hide') }}</span>
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click.stop="enabled(node.data)"
              >
                <span v-if="node.data.enabled" style="color: red">{{ $t('table.data.menu.disable') }}</span>
                <span v-else style="color: #67C23A">{{ $t('table.data.menu.enable') }}</span>
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            {{ $t('table.search') }}
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                     @click="handleCreate(null)"
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
          row-key="id"
          border
          fit
          size="mini"
          style="width: 100%;"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @sort-change="sortChange"
        >
          <el-table-column :label="$t('table.id')" sortable="true" align="center" width="80px" />
          <el-table-column :label="$t('table.data.menu.title')" width="110px">
            <template v-slot="{row}">
              <span :style="{'font-weight': row.parentId === 0 ? 'bolder' : '','padding-left': row.parentId !== 0 ? '10px' : ''}">
                <i :class="row.metaIcon" />
                {{ row.metaTitle }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.data.menu.path')" width="120px">
            <template v-slot="{row}">
              <span>{{ row.path }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.data.menu.name')" width="100px">
            <template v-slot="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.data.menu.sort')" width="120px" align="center">
            <template v-slot="{row}">
              <span>{{ row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.data.menu.roles')" class-name="status-col">
            <template v-slot="{row}">
              <el-tag
                v-for="(role,index) in row.roles"
                :key="index"
                closable
                :type="tagType[role.id]"
                style="margin-right: 3px;border-radius: 15px;"
                :title="role.description"
                size="mini"
                @close="deleteMenuRole(row.id, role.id)"
              >
                {{ role.name }}
              </el-tag>
              <el-dropdown trigger="click" @command="addMenuRole(row.id, $event)">
                <el-button style="border-radius: 20px;" size="mini" @click="getMenuNotRoleList(row.id)">+</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(role,index) in roleList"
                    :key="index"
                    size="mini"
                    :title="role.description"
                    :command="role.id"
                  >{{ role.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.actions')" align="left" class-name="small-padding fixed-width" width="280px">
            <template v-slot="{row}">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
                {{ $t('table.edit') }}
              </el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteData(row)">
                {{ $t('table.delete') }}
              </el-button>
              <el-button size="mini" type="warning" icon="el-icon-circle-plus-outline" @click="handleCreate(row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>

    </el-row>
    <el-dialog :title="$t(textMap[dialogStatus])" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="menu" label-position="left" label-width="160px"
               style="width: 800px; margin-left:50px;" :inline="true"
      >
        <el-form-item :label="$t('table.data.menu.title')" prop="metaTitle">
          <el-input v-model="menu.metaTitle" :placeholder="$t('table.data.menu.titlePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.menu.path')" prop="path">
          <el-input v-model="menu.path" :placeholder="$t('table.data.menu.pathPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.menu.name')" prop="name">
          <el-input v-model="menu.name" :placeholder="$t('table.data.menu.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.menu.icon')" prop="metaIcon">
          <el-input v-model="menu.metaIcon" :placeholder="$t('table.data.menu.iconPlaceholder')" style="width: 190px;" readonly>
            <template slot="append"><i class="el-icon-s-operation" @click="drawer = true" /></template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('table.data.menu.sort')" prop="sort">
          <el-input v-model="menu.sort" type="number" :placeholder="$t('table.data.menu.sortPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.menu.hidden')" prop="hidden">
          <el-switch
            v-model="menu.hidden"
            style="width: 190px"
            :active-text="$t('table.data.menu.hide')"
            :inactive-text="$t('table.data.menu.display')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.data.menu.enabled')" prop="enabled">
          <el-switch
            v-model="menu.enabled"
            style="width: 190px"
            :active-text="$t('table.data.menu.enable')"
            :inactive-text="$t('table.data.menu.disable')"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.close') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.save') }}</el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="菜单图标"
      :visible.sync="drawer"
      :with-header="false"
      :before-close="handleClose"
    >
      <icon :select="menu.metaIcon" @select-icon="selectIcon" />
    </el-drawer>

  </div>
</template>
<script>
import Icon from './components/Icon'
import {
  getMenuTree,
  moveMenu,
  createMenu,
  hiddenMenu,
  enabledMenu,
  deleteMenu,
  deleteMenuRole,
  updateMenu,
  getMenuNotRoleList,
  addMenuRole,
  exportMenuExcel
} from '@/api/data/menu'
import { getRoleList } from '@/api/data/role'

export default {
  name: 'Menu',
  components: { Icon },
  data() {
    return {
      tableKey: 0,
      list: [],
      listLoading: false,
      listQuery: {
        path: null,
        name: null,
        metaTitle: null,
        hidden: null,
        enabled: null,
        queryRoleId: null
      },
      tagType: ['', 'success', 'info', 'warning', 'danger'],
      menu: {
        path: null,
        name: null,
        metaTitle: null,
        metaIcon: null,
        hidden: false,
        enabled: true,
        sort: null,
        parentId: 0
      },
      roles: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: 'table.add',
        update: 'table.edit'
      },
      roleList: [],
      downloadLoading: false,
      drawer: false,
      menuTree: [],
      filterText: '',
      expandedKeys: []
    }
  },
  computed: {
    rules() {
      return {
        metaTitle: [{ required: true, message: this.$t('table.data.menu.titleRule'), trigger: 'change' }],
        path: [{ required: true, message: this.$t('table.data.menu.pathRule'), trigger: 'change' }],
        name: [{ required: true, message: this.$t('table.data.menu.nameRule'), trigger: 'change' }],
        metaIcon: [{ required: true, message: this.$t('table.data.menu.iconRule'), trigger: 'change' }],
        sort: [{ required: true, message: this.$t('table.data.menu.sortRule'), trigger: 'change' }],
        hidden: [{ required: true, message: this.$t('table.data.menu.hiddenRule'), trigger: 'change' }],
        enabled: [{ required: true, message: this.$t('table.data.menu.enabledRule'), trigger: 'change' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getMenuTree().then(res => {
        setTimeout(() => {
          if (this.listLoading === true) {
            this.listLoading = false
          }
        }, 1000)
        this.list = res.data
        this.listLoading = false
        this.menuTree = this.buildTree(this.list)
      })
    },
    buildTree(menus) {
      const tree = []
      for (const menu of menus) {
        menu.disabled = menu.hidden || !menu.enabled
        const node = JSON.parse(JSON.stringify(menu))
        tree.push(node)
        this.buildTree(node.children)
      }
      return tree
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.metaTitle.indexOf(value) !== -1 || data.name.indexOf(value) !== -1 || data.path.indexOf(value) !== -1
    },
    nodeExpand(data) {
      this.expandedKeys.push(data.id)
    },
    nodeCollapse(data) {
      this.expandedKeys = this.expandedKeys.filter(num => num !== data.id)
      if (data.children) {
        for (const child of data.children) {
          this.nodeCollapse(child)
        }
      }
    },
    hidden(row) {
      hiddenMenu(row.id, !row.hidden).then(res => {
        this.$notify({
          title: this.$t('common.success'),
          message: this.$t(res.message),
          type: 'success',
          duration: 2000
        })
        this.loadData()
      })
    },
    enabled(row) {
      enabledMenu(row.id, !row.enabled).then(res => {
        this.$notify({
          title: this.$t('common.success'),
          message: this.$t(res.message),
          type: 'success',
          duration: 2000
        })
        this.loadData()
      })
    },
    handleCreate(row) {
      this.menu = {}
      this.menu.parentId = row === null ? 0 : row.id
      this.menu.hidden = false
      this.menu.enabled = true
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
              title: this.$t('common.success'),
              message: this.$t(res.message),
              type: 'success',
              duration: 2000
            })
            this.loadData()
          })
        }
      })
    },
    handleUpdate(row) {
      this.menu = Object.assign({}, row) // copy obj
      this.menu.children = null
      this.menu.roles = null
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateMenu(this.menu).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t(res.message),
              type: 'success',
              duration: 2000
            })
            this.loadData()
          })
        }
      })
    },
    deleteData(row) {
      this.$confirm(this.$t('table.data.menu.deleteTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
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
          message: this.$t('common.cancelDelete')
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
      this.loadData()
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // 更新父节点
      const data = draggingNode.data
      const dropData = dropNode.data
      if (dropType === 'inner') {
        data.parentId = dropData.id
      } else {
        data.parentId = dropData.parentId
        data.sort = dropData.sort + (dropType === 'before' ? 0 : 1)
      }
      moveMenu(data)
    },
    getRoleList(callback) {
      if (callback === true && this.roles === null) {
        getRoleList(null).then(res => {
          this.roles = res.data
        })
      }
    },
    handleClose(done) {
      done()
    },
    selectIcon(icon) {
      this.menu.metaIcon = icon
      this.drawer = false
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
      exportMenuExcel(this.listQuery, '系统菜单列表')
    }
  }
}
</script>

<style>
.el-drawer__body {
  overflow: auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
