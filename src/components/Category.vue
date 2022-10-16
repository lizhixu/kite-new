<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">网站分类</span>
      </div>
    </template>
    <div class="category">
      <el-button round>PHP</el-button>
      <el-button round>Go</el-button>
      <el-button round>Vue</el-button>
      <el-button round>Mysql</el-button>
      <el-button round>PHP</el-button>
      <el-button round>游戏相关</el-button>
      <el-button round>生活动弹</el-button>
    </div>
  </el-card>
</template>

<script setup>
</script>

<style scoped>
.category>button{
  margin: 5px;
}
</style>