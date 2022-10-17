<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">标签云</span>
      </div>
    </template>
    <div class="category-label">
      <el-tag class="category-label-tag" type="success" v-for="o in 10">
        <router-link to="" style="color: #00965e">
          Tag {{ o }}
        </router-link>
      </el-tag>
    </div>
  </el-card>
</template>

<script setup>
</script>

<style scoped>
.category-label-tag {
  margin: 0.25rem;
}
</style>