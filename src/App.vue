<template>
  <div class="bg">
    <el-affix :offset="0">
      <div class="k-header-bg">
        <Header/>
      </div>
    </el-affix>
    <div class="main">
      <RouterView :key="route.path"/>
    </div>
  </div>
  <el-backtop :right="100" :bottom="100"/>
</template>
<script setup>
import {RouterView, useRoute} from 'vue-router'
import Header from "@/views/Layout/Header.vue";
import {useConfigStore} from "@/stores/config";
import {loadJs} from "@/utils/util";

const route = useRoute()
const useConfig = useConfigStore();
provide('blogConfig', useConfig.config)//网站配置
loadJs('//sdk.51.la/js-sdk-pro.min.js', () => {
  LA.init({id: "KK9yxWDTe8RbtoIZ", ck: "KK9yxWDTe8RbtoIZ", hashMode: true})
})
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

.img {
  transition: all 0.2s linear;
}

.img:hover {
  transform: scale(1.2);
  transition: all 0.2s linear;
}

*::selection {
  background-color: #00325e;
  color: white;
  -webkit-text-fill-color: white;
}
</style>