<template>
  <el-container class="bg">
    <el-header>
      <el-affix :offset="0">
        <div class="k-header-bg">
          <Header/>
        </div>
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
.k-header-bg{
  background-color: rgba(255, 255, 255, .96);
  box-shadow: 0px 5px 40px 0px rgb(17 58 93 / 10%);
  border-top: 2px solid #5cb9ff;
}
</style>