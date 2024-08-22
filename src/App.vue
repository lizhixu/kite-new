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
import {assembleTheAvatar, loadJs} from "@/utils/util";
import {onMounted, provide} from "vue";
import {useStarLink} from "@/hooks/background/useStarLink";
import {findOne} from "@/utils/strapi";
import {jwtDecode} from "jwt-decode";

const token = ref('');
const me = ref();
provide('token', token);
provide('me', me)//网站配置

const route = useRoute()
const useConfig = useConfigStore();
provide('blogConfig', useConfig.config)//网站配置
loadJs('//sdk.51.la/js-sdk-pro.min.js', () => {
  LA.init({id: "KK9yxWDTe8RbtoIZ", ck: "KK9yxWDTe8RbtoIZ", hashMode: true})
})
onMounted(() => {
  useStarLink().init();
  token.value = localStorage.getItem('token');
})

watch(token, (newVal) => {
  if (!newVal) return
  const id = jwtDecode(newVal)?.id;
  findOne('users', id, {populate: '*'}).then((res) => {
    me.value = assembleTheAvatar(res);
  })
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