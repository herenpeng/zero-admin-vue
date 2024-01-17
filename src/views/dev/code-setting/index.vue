<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="表信息配置" name="tableInfo">
        <el-form ref="dataForm" :rules="rules" :model="tableInfo" label-position="left" label-width="120px"
                 style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="数据库表名称" prop="name">
            <el-input v-model="tableInfo.name" placeholder="请选择数据表名称" disabled="disabled" />
          </el-form-item>
          <el-form-item label="数据库表描述" prop="comment">
            <el-input v-model="tableInfo.comment" placeholder="请输入数据库表描述" />
          </el-form-item>
          <el-form-item label="实体类名称" prop="entityName">
            <el-input v-model="tableInfo.entityName" placeholder="请输入实体类名称" />
          </el-form-item>
          <el-form-item label="Java代码路径" prop="javaCodePath">
            <el-input v-model="tableInfo.javaCodePath" placeholder="请输入Java代码路径" />
          </el-form-item>
          <el-form-item label="类请求路径" prop="entityName">
            <el-input v-model="tableInfo.requestMapping" placeholder="请输入类请求路径" />
          </el-form-item>
          <el-form-item label="包前缀名称" prop="javaPackageName">
            <el-input v-model="tableInfo.javaPackageName" placeholder="请输入包前缀名称" />
          </el-form-item>
          <el-form-item label="Vue代码路径" prop="vueCodePath">
            <el-input v-model="tableInfo.vueCodePath" placeholder="请输入Vue代码路径" />
          </el-form-item>
          <el-form-item label="Vue包路径" prop="vuePackage">
            <el-input v-model="tableInfo.vuePackage" placeholder="Vue包路径" />
          </el-form-item>
          <el-form-item label="是否为树状结构">
            <el-switch
              v-model="tableInfo.tree"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
          <el-form-item label="是否覆盖同名文件">
            <el-switch
              v-model="tableInfo.cover"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
          <el-form-item label="代码作者" prop="codeAuthor">
            <el-input v-model="tableInfo.codeAuthor" placeholder="请输入代码作者" disabled="disabled" />
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" :disabled="disabled" @click="updateTableInfo()">保存</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="表字段配置" name="tableColumn">
        <table-column :table-info-id="tableInfo.id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  getById,
  updateTableInfo
} from '@/api/dev/code-generate'

import TableColumn from './components/TableColumn'

export default {
  name: 'CodeSetting',
  components: { TableColumn },
  data() {
    return {
      activeName: 'tableInfo',
      disabled: false,
      tableInfo: {
        id: null,
        name: null,
        comment: null,
        entityName: null,
        javaCodePath: null,
        requestMapping: null,
        javaPackageName: null,
        vueCodePath: null,
        vuePackage: null,
        tree: false,
        cover: false,
        codeAuthor: null
      },
      dialogStatus: '',
      textMap: {
        create: '添加',
        update: '编辑'
      },
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
      }
    }
  },
  created() {
    const id = this.$route.query.id
    if (id !== null && id !== '' && id !== undefined) {
      this.getById(id)
    } else {
      this.disabled = true
    }
  },
  methods: {
    getById(id) {
      getById(id).then(res => {
        this.tableInfo = res.data
      })
    },
    updateTableInfo() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateTableInfo(this.tableInfo).then((res) => {
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
    }
  }
}
</script>

<style scoped>

</style>
