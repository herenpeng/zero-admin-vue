<template>
  <div class="app-container">
    <el-row>
      <el-col v-for="(icon,index) in iconList" :key="index" :span="4">
        <div :title="icon" @click="clickHandler(icon)" :class="{select: icon === select}"><i :class="icon" /></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import iconList from '@/assets/icon.json'

export default {
  name: 'Icon',
  props: {
    select: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      iconList: []
    }
  },
  created() {
    this.iconList = iconList
  },
  methods: {
    clickHandler: function(icon) {
      this.select = icon
      this.$emit('select-icon', icon)
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-bottom: 5px;
  }
  .el-col {
    padding: 5px 5px;
  }
  .el-col div {
    border-radius: 4px;
    text-align: center;
    padding: 15px 5px;
  }
  .el-col div:hover, .select {
    box-shadow: 0 2px 4px rgba(0, 123, 225, 0.5), 0 0 6px rgba(23, 33, 59, 0.5);
  }
</style>
