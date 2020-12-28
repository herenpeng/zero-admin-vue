<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4"><div><i class="el-icon-platform-eleme" /></div></el-col>
      <el-col :span="4"><div><i class="el-icon-eleme" /></div></el-col>
      <el-col :span="4"><div><i class="el-icon-delete-solid" /></div></el-col>
      <el-col :span="4"><div><i class="el-icon-delete" /></div></el-col>
      <el-col :span="4"><div><i class="el-icon-s-tools" /></div></el-col>
      <el-col :span="4"><div><i class="el-icon-setting" /></div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div><i class="el-icon-platform-eleme" /></div></el-col>
      <el-col :span="4"><div><i class="el-icon-eleme" /></div></el-col>
      <el-col :span="4"><div><i class="el-icon-delete-solid" /></div></el-col>
      <el-col :span="4"><div><i class="el-icon-delete" /></div></el-col>
      <el-col :span="4"><div><i class="el-icon-s-tools" /></div></el-col>
      <el-col :span="4"><div><i class="el-icon-setting" /></div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Icon'
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
