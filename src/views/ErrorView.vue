<template>
  <div :style="{margin: 'auto',height:height +'px','text-align':'center'}">
    <img src="/404.png" alt="">
    <p>页面走失了</p>
    <el-button type="warning">
      <router-link to="/">回到首页</router-link>
    </el-button>
  </div>
</template>

<script setup>
const height = ref(window.innerHeight)
</script>

<style scoped>
</style>