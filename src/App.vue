<template>
  <div class="bg">
    <el-affix :offset="0">
      <div class="k-header-bg">
        <Header/>
      </div>
    </el-affix>
    <div class="main">
      <RouterView/>
    </div>
  </div>
  <el-backtop :right="100" :bottom="100"/>
</template>
<script setup>
import {ref} from 'vue'
import {RouterLink, RouterView} from 'vue-router'
import Header from "@/views/Layout/Header.vue";

</script>
<style>
@import './assets/fonts.css';

.main {
  width: 1110px;
  margin: 20px auto;
}

.k-header-bg {
  background-color: rgba(255, 255, 255, .96);
  box-shadow: 0px 5px 40px 0px rgb(17 58 93 / 10%);
  border-top: 2px solid #5cb9ff;
}
</style>