<template>
  <el-row>
    <el-col :span="5">
      {{ name }}：
    </el-col>
    <el-col :span="14">
      <template v-if="editState">
        <el-switch v-model="data"
                   :active-text="activeText"
                   :inactive-text="inactiveText"
                   style="width: 75%;margin-right: 10px;padding-left: 30%;"
        />
        <el-button
          class="cancel-btn"
          size="small"
          type="warning"
          icon="el-icon-close"
          @click="cancel()"
        >
          {{ $t('table.close') }}
        </el-button>
      </template>
      <span v-else>{{ data === null ? editTip : (data ? activeText : inactiveText) }}</span>
    </el-col>
    <el-col :span="5">
      <el-button
        v-if="editState"
        type="success"
        size="small"
        icon="el-icon-check"
        @click="confirm()"
      >
        {{ $t('table.save') }}
      </el-button>
      <el-button
        v-else
        type="primary"
        size="small"
        icon="el-icon-edit"
        @click="edit()"
      >
        {{ $t('table.edit') }}
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'UserInfoEdit',
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    editState: {
      type: Boolean,
      default: false
    },
    editTip: {
      type: String,
      default: ''
    },
    activeText: {
      type: String,
      default: ''
    },
    inactiveText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: this.value,
      pickerOptions: {
        disabledDate(time) {
          // 如果没有后面的-8.64e6就是不可以选择今天的
          return time.getTime() > Date.now() - 8.64e6
        }
      }
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.data = newValue
    }
  },
  methods: {
    edit() {
      this.$emit('edit')
    },
    confirm() {
      this.$emit('confirm', this.data)
    },
    cancel() {
      this.data = this.value
      this.$emit('cancel')
    }
  }
}
</script>
