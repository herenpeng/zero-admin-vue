<template>
  <div class="app-container">
    <el-row v-for="(icons,index) in iconList" :key="index">
      <el-col v-for="(icon,index) in icons" :key="index" :span="4">
        <div :title="icon" @click="clickHandler(icon)"><i :class="icon" /></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import iconList from '@/assets/icon.json'

export default {
  name: 'Icon',
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
    box-shadow: 0 2px 4px rgba(0, 123, 225, 0.5), 0 0 6px rgba(0, 60, 225, 0.5);
    border-radius: 4px;
    text-align: center;
    padding: 15px 5px;
  }
</style>
