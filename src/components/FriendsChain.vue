<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">友链</span>
        <el-button text>
          <IconApply/>
        </el-button>
      </div>
    </template>
    <div class="f-link">
      <el-link href="https://element.eleme.io" target="_blank"> default</el-link>
      <el-link href="https://element.eleme.io" type="primary">primary</el-link>
      <el-link type="success">success</el-link>
      <el-link type="warning">warning</el-link>
      <el-link type="danger">danger</el-link>
      <el-link type="info">info</el-link>
    </div>
  </el-card>
</template>

<script setup>
</script>

<style scoped>

.f-link > a {
  margin-right: 8px;
  text-decoration: none;
  background: transparent;
}
</style>