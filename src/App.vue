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
import {app_path, assembleTheAvatar, deleteCache, loadJs} from "@/utils/util";
import {onMounted, provide, watch} from "vue";
import {useStarLink} from "@/hooks/background/useStarLink";
import {findOne} from "@/utils/strapi";
import {jwtDecode} from "jwt-decode";
import Cookies from 'js-cookie'

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
  
  // 检查 URL query 中是否存在 OAuth 返回的 token
  const urlParams = new URLSearchParams(window.location.search);
  const tokenInUrl = urlParams.get('token');
  if (tokenInUrl) {
    localStorage.setItem('token', tokenInUrl);
    token.value = tokenInUrl;
    urlParams.delete('token');
    const newSearch = urlParams.toString();
    const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
    window.history.replaceState({}, '', newUrl);
  } else {
    token.value = localStorage.getItem('token') || '';
  }

  window.deleteCache = () => {
    deleteCache();
    token.value = '';
    me.value = null;
  };
})

watch(token, (newVal) => {
  if (!newVal) {
    me.value = null;
    return;
  }
  const domain = import.meta.env.MODE === 'development' ? '' : app_path.replace('https://', '.');
  const api = Cookies.withAttributes({path: '/', domain: domain});
  !api.get('token') && api.set('token', newVal, {expires: 7});

  try {
    const decoded = jwtDecode(newVal);
    if (decoded?.username) {
      me.value = assembleTheAvatar({
        id: decoded.id,
        username: decoded.username,
        avatar_url: decoded.avatar_url,
        provider: decoded.provider || 'github',
        isAdmin: decoded.isAdmin
      });
      return;
    }
    const id = decoded?.id;
    findOne('users', id, {populate: '*'}).then((res) => {
      const u = res?.data?.attributes || res?.data || res;
      me.value = assembleTheAvatar(u);
    });
  } catch (err) {
    findOne('users', 1, {populate: '*'}).then((res) => {
      const u = res?.data?.attributes || res?.data || res;
      me.value = assembleTheAvatar(u);
    });
  }
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