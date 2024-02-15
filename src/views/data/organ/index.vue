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
          :data="organTree"
          node-key="id"
          :default-expanded-keys="expandedKeys"
          :filter-node-method="filterNode"
          draggable
          @node-drop="handleDrop"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        >
          <span slot-scope="{ node }" class="custom-tree-node">
            <span><i :class="node.data.name" />{{ node.data.name }}</span>
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
          <el-table-column :label="$t('table.id')" sortable="true" align="center" width="80" />
          <el-table-column :label="$t('table.data.organ.name')" align="center">
            <template v-slot="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.data.organ.sort')" width="150px" align="center">
            <template v-slot="{row}">
              <span>{{ row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width" width="280px" fixed="right">
            <template v-slot="{row}">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
                {{ $t('table.edit') }}
              </el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteData(row)">
                {{ $t('table.delete') }}
              </el-button>
              <el-button size="mini" type="warning" icon="el-icon-circle-plus-outline" @click="handleCreate(row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog :title="$t(textMap[dialogStatus])" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="organ" label-position="left" label-width="170px"
               style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.data.organ.name')" prop="name">
          <el-input v-model="organ.name" :placeholder="$t('table.data.organ.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('table.data.organ.sort')" prop="sort">
          <el-input v-model="organ.sort" type="number" :placeholder="$t('table.data.organ.sortPlaceholder')" />
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
import {
  getOrganTree,
  moveOrgan,
  createOrgan,
  updateOrgan,
  deleteOrgan,
  exportOrganExcel
} from '@/api/data/organ'

export default {
  name: 'Organ',
  data() {
    return {
      tableKey: 0,
      list: [],
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
        create: 'table.add',
        update: 'table.edit'
      },
      downloadLoading: false,
      organTree: [],
      filterText: '',
      expandedKeys: []
    }
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: this.$t('table.data.organ.nameRule'), trigger: 'change' }],
        sort: [{ required: true, message: this.$t('table.data.organ.sortRule'), trigger: 'change' }],
        // parentId: [{ required: true, message: '请输入父级组织机构主键，如果为顶级组织机构，值为0', trigger: 'change' }]
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
      getOrganTree().then(res => {
        setTimeout(() => {
          if (this.listLoading === true) {
            this.listLoading = false
          }
        }, 1000)
        this.list = res.data
        this.listLoading = false
        this.organTree = this.buildTree(this.list)
      })
    },
    buildTree(organs) {
      const tree = []
      for (const organ of organs) {
        organ.disabled = organ.hidden || !organ.enabled
        const node = JSON.parse(JSON.stringify(organ))
        tree.push(node)
        this.buildTree(node.children)
      }
      return tree
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
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
    handleCreate(row) {
      this.organ = {}
      this.organ.parentId = row === null ? 0 : row.id
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
    deleteData(row) {
      this.$confirm(this.$t('common.deleteTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
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
          message: this.$t('common.cancelDelete')
        })
      })
    },
    handleFilter() {
      this.loadData()
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      const data = draggingNode.data
      const dropData = dropNode.data
      if (dropType === 'inner') {
        data.parentId = dropData.id
      } else {
        data.parentId = dropData.parentId
        data.sort = dropData.sort + (dropType === 'before' ? 0 : 1)
      }
      moveOrgan(data)
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
      exportOrganExcel(this.listQuery, this.$t('common.exportFileName'))
    }
  }
}
</script>
<style scoped>

</style>
