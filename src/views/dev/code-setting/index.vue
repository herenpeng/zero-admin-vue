<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('table.dev.codeGenerate.tableInfo')" name="tableInfo">
        <el-form ref="dataForm" :rules="rules" :model="tableInfo" label-position="left" label-width="180px"
                 style="width: 800px; margin-left:50px;" :inline="true"
        >
          <el-form-item :label="$t('table.dev.codeGenerate.name')" prop="name">
            <el-input v-model="tableInfo.name" placeholder="请选择数据表名称" disabled="disabled" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.comment')" prop="comment">
            <el-input v-model="tableInfo.comment" placeholder="请输入数据库表描述" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.entityName')" prop="entityName">
            <el-input v-model="tableInfo.entityName" placeholder="请输入实体类名称" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.javaCodePath')" prop="javaCodePath">
            <el-input v-model="tableInfo.javaCodePath" placeholder="请输入Java代码路径" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.requestMapping')" prop="requestMapping">
            <el-input v-model="tableInfo.requestMapping" placeholder="请输入类请求路径" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.javaPackageName')" prop="javaPackageName">
            <el-input v-model="tableInfo.javaPackageName" placeholder="请输入包前缀名称" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.vueCodePath')" prop="vueCodePath">
            <el-input v-model="tableInfo.vueCodePath" placeholder="请输入Vue代码路径" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.vuePackage')" prop="vuePackage">
            <el-input v-model="tableInfo.vuePackage" placeholder="Vue包路径" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.tree')" prop="tree">
            <el-switch
              v-model="tableInfo.tree"
              style="width: 190px"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.cover')" prop="cover">
            <el-switch
              v-model="tableInfo.cover"
              style="width: 190px"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.codeAuthor')" prop="codeAuthor">
            <el-input v-model="tableInfo.codeAuthor" placeholder="请输入代码作者" disabled="disabled" />
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" :disabled="disabled" @click="updateTableInfo()">{{ $t('table.save') }}</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="$t('table.dev.codeGenerate.tableColumn')" name="tableColumn">
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
        create: 'table.add',
        update: 'table.edit'
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
