<template>
  <div>
    <el-form ref="dataForm" :rules="rules" :model="tableInfo" label-position="left" label-width="150px"
             style="width: 1000px; margin-left:50px;" :inline="true"
    >
      <el-form-item :label="$t('table.dev.codeGenerate.name')" prop="name">
        <el-input v-model="tableInfo.name" :placeholder="$t('table.dev.codeGenerate.namePlaceholder')" disabled="disabled" style="width: 300px;" />
      </el-form-item>
      <el-form-item :label="$t('table.dev.codeGenerate.comment')" prop="comment">
        <el-input v-model="tableInfo.comment" :placeholder="$t('table.dev.codeGenerate.commentPlaceholder')" style="width: 300px;" />
      </el-form-item>
      <el-form-item :label="$t('table.dev.codeGenerate.entityName')" prop="entityName">
        <el-input v-model="tableInfo.entityName" :placeholder="$t('table.dev.codeGenerate.entityNamePlaceholder')" style="width: 300px;" />
      </el-form-item>
      <el-form-item :label="$t('table.dev.codeGenerate.javaCodePath')" prop="javaCodePath">
        <el-input v-model="tableInfo.javaCodePath" :placeholder="$t('table.dev.codeGenerate.javaCodePathPlaceholder')" style="width: 300px;" />
      </el-form-item>
      <el-form-item :label="$t('table.dev.codeGenerate.requestMapping')" prop="requestMapping">
        <el-input v-model="tableInfo.requestMapping" :placeholder="$t('table.dev.codeGenerate.requestMappingPlaceholder')" style="width: 300px;" />
      </el-form-item>
      <el-form-item :label="$t('table.dev.codeGenerate.javaPackage')" prop="javaPackage">
        <el-input v-model="tableInfo.javaPackage" :placeholder="$t('table.dev.codeGenerate.javaPackagePlaceholder')" style="width: 300px;" />
      </el-form-item>
      <el-form-item :label="$t('table.dev.codeGenerate.vueCodePath')" prop="vueCodePath">
        <el-input v-model="tableInfo.vueCodePath" :placeholder="$t('table.dev.codeGenerate.vueCodePathPlaceholder')" style="width: 300px;" />
      </el-form-item>
      <el-form-item :label="$t('table.dev.codeGenerate.vuePackage')" prop="vuePackage">
        <el-input v-model="tableInfo.vuePackage" :placeholder="$t('table.dev.codeGenerate.vuePackagePlaceholder')" style="width: 300px;" />
      </el-form-item>
      <el-form-item :label="$t('table.dev.codeGenerate.tree')" prop="tree">
        <el-switch
          v-model="tableInfo.tree"
          style="width: 300px"
          :active-text="$t('common.true')"
          :inactive-text="$t('common.false')"
        />
      </el-form-item>
      <el-form-item :label="$t('table.dev.codeGenerate.cover')" prop="cover">
        <el-switch
          v-model="tableInfo.cover"
          style="width: 300px"
          :active-text="$t('common.true')"
          :inactive-text="$t('common.false')"
        />
      </el-form-item>
      <el-form-item :label="$t('table.dev.codeGenerate.codeAuthor')" prop="codeAuthor">
        <el-input v-model="tableInfo.codeAuthor" :placeholder="$t('table.dev.codeGenerate.codeAuthorPlaceholder')" disabled="disabled" style="width: 300px;" />
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button type="primary" :disabled="disabled" @click="updateTableInfo()">{{ $t('table.save') }}</el-button>
      <router-link :to="{path:'/dev/code-generate'}" style="margin-left: 10px">
        <el-button type="success">{{ $t('table.back') }}</el-button>
      </router-link>
    </div>
  </div>
</template>
<script>
import { getById, updateTableInfo } from '@/api/dev/code-generate'

export default {
  name: 'TableInfo',
  data() {
    return {
      disabled: false,
      tableInfo: {
        id: null,
        name: null,
        comment: null,
        entityName: null,
        javaCodePath: null,
        requestMapping: null,
        javaPackage: null,
        vueCodePath: null,
        vuePackage: null,
        tree: false,
        cover: false,
        codeAuthor: null
      }
    }
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: this.$t('table.dev.codeGenerate.nameRule'), trigger: 'change' }],
        comment: [{ required: true, message: this.$t('table.dev.codeGenerate.commentRule'), trigger: 'change' }],
        entityName: [{ required: true, message: this.$t('table.dev.codeGenerate.entityNameRule'), trigger: 'change' }],
        requestMapping: [{ required: true, message: this.$t('table.dev.codeGenerate.requestMappingRule'), trigger: 'change' }],
        javaPackage: [{ required: true, message: this.$t('table.dev.codeGenerate.javaPackageRule'), trigger: 'change' }],
        javaCodePath: [{ required: true, message: this.$t('table.dev.codeGenerate.javaCodePathRule'), trigger: 'change' }],
        vueCodePath: [{ required: true, message: this.$t('table.dev.codeGenerate.vueCodePathRule'), trigger: 'change' }],
        vuePackage: [{ required: true, message: this.$t('table.dev.codeGenerate.vuePackageRule'), trigger: 'change' }]
      }
    }
  },
  watch: {
    '$route.query.id'(newValue, oldValue) {
      if (newValue && (!this.tableInfo || this.tableInfo.id !== newValue)) {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const id = this.$route.query.id
      if (id !== null && id !== '' && id !== undefined) {
        getById(id).then(res => {
          this.tableInfo = res.data
        })
      } else {
        this.disabled = true
      }
    },
    updateTableInfo() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateTableInfo(this.tableInfo).then((res) => {
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t(res.message),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
