<template>
  <el-container class="bg">
    <el-header>
      <el-affix :offset="0">
        <Header/>
      </el-affix>
    </el-header>
    <el-main>
      <RouterView/>
    </el-main>
  </el-container>
  <el-backtop :right="100" :bottom="100"/>
</template>
<script setup>
import {ref} from 'vue'
import {RouterLink, RouterView} from 'vue-router'
import Header from "@/views/Layout/Header.vue";

</script>
<style>
@import './assets/fonts.css';

.el-main {
  width: 1110px;
  margin: auto;
}
</style>