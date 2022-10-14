<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">热门文章</span>
      </div>
    </template>
    <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
  </el-card>
</template>

<script setup>
</script>

<style scoped>

</style>