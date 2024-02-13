<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('table.dev.codeGenerate.tableInfo')" name="tableInfo">
        <el-form ref="dataForm" :rules="rules" :model="tableInfo" label-position="left" label-width="180px"
                 style="width: 800px; margin-left:50px;" :inline="true"
        >
          <el-form-item :label="$t('table.dev.codeGenerate.name')" prop="name">
            <el-input v-model="tableInfo.name" :placeholder="$t('table.dev.codeGenerate.namePlaceholder')" disabled="disabled" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.comment')" prop="comment">
            <el-input v-model="tableInfo.comment" :placeholder="$t('table.dev.codeGenerate.commentPlaceholder')" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.entityName')" prop="entityName">
            <el-input v-model="tableInfo.entityName" :placeholder="$t('table.dev.codeGenerate.entityNamePlaceholder')" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.javaCodePath')" prop="javaCodePath">
            <el-input v-model="tableInfo.javaCodePath" :placeholder="$t('table.dev.codeGenerate.javaCodePathPlaceholder')" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.requestMapping')" prop="requestMapping">
            <el-input v-model="tableInfo.requestMapping" :placeholder="$t('table.dev.codeGenerate.requestMappingPlaceholder')" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.javaPackageName')" prop="javaPackageName">
            <el-input v-model="tableInfo.javaPackageName" :placeholder="$t('table.dev.codeGenerate.javaPackageNamePlaceholder')" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.vueCodePath')" prop="vueCodePath">
            <el-input v-model="tableInfo.vueCodePath" :placeholder="$t('table.dev.codeGenerate.vueCodePathPlaceholder')" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.vuePackage')" prop="vuePackage">
            <el-input v-model="tableInfo.vuePackage" :placeholder="$t('table.dev.codeGenerate.vuePackagePlaceholder')" />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.tree')" prop="tree">
            <el-switch
              v-model="tableInfo.tree"
              style="width: 190px"
              :active-text="$t('common.true')"
              :inactive-text="$t('common.false')"
            />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.cover')" prop="cover">
            <el-switch
              v-model="tableInfo.cover"
              style="width: 190px"
              :active-text="$t('common.true')"
              :inactive-text="$t('common.false')"
            />
          </el-form-item>
          <el-form-item :label="$t('table.dev.codeGenerate.codeAuthor')" prop="codeAuthor">
            <el-input v-model="tableInfo.codeAuthor" :placeholder="$t('table.dev.codeGenerate.codeAuthorPlaceholder')" disabled="disabled" />
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
        name: [{ required: true, message: this.$t('table.dev.codeGenerate.nameRule'), trigger: 'change' }],
        comment: [{ required: true, message: this.$t('table.dev.codeGenerate.commentRule'), trigger: 'change' }],
        entityName: [{ required: true, message: this.$t('table.dev.codeGenerate.entityNameRule'), trigger: 'change' }],
        requestMapping: [{ required: true, message: this.$t('table.dev.codeGenerate.requestMappingRule'), trigger: 'change' }],
        javaPackageName: [{ required: true, message: this.$t('table.dev.codeGenerate.javaPackageNameRule'), trigger: 'change' }],
        javaCodePath: [{ required: true, message: this.$t('table.dev.codeGenerate.javaCodePathRule'), trigger: 'change' }],
        vueCodePath: [{ required: true, message: this.$t('table.dev.codeGenerate.vueCodePathRule'), trigger: 'change' }],
        vuePackage: [{ required: true, message: this.$t('table.dev.codeGenerate.vuePackageRule'), trigger: 'change' }]
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
