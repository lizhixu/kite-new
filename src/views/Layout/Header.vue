<template>
  <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
      class="k-header"
      active-text-color="#5cb9ff" :router="true"
  >
    <el-menu-item class="logo">
      <router-link to="/">
        <img :src="logo"
             alt="" style="width: 50px;">
      </router-link>
    </el-menu-item>
    <el-menu-item index="/">首页</el-menu-item>
    <el-sub-menu index="2">
      <template #title>专栏</template>
      <template v-for="cate in category.categories">
        <el-menu-item :index="'/special/'+cate.id" v-if="cate.attributes.status">{{
            cate.attributes.name
          }}
        </el-menu-item>
      </template>
    </el-sub-menu>
    <el-menu-item index="3">Tool</el-menu-item>
    <div class="flex-grow"/>
    <el-menu-item class="k-avatar">
      <template #title>
        <el-icon>
          <Cellphone/>
        </el-icon>
        <span>登录</span>
      </template>
    </el-menu-item>
    <el-menu-item class="k-avatar">
      <el-avatar
          src="//p3-passport.byteimg.com/img/user-avatar/cb1d6d812c74b1540552190d2429e81d~180x180.awebp"></el-avatar>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import {ref} from 'vue'
import {find} from "@/utils/strapi";
import {useCategoryStore} from "@/stores/category";

const activeIndex = ref('/')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
const category = useCategoryStore();

const blogConfig = ref();
const logo = ref('');
find('blog-config', {populate: '*'}).then((res) => {
  blogConfig.value = res.data.attributes;
  logo.value = import.meta.env.VITE_API_URL + blogConfig.value.logo.data[0].attributes.url
});

</script>

<style>
.flex-grow {
  flex-grow: 1;
}

.el-header {
  --el-header-padding: 0px;
}

.k-header {
  width: 1110px;
  margin: auto;
  border-bottom: none !important;
  background-color: #FFFFFF00;
}

.logo:after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 1px;
  height: 20px;
  background: #ddd;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}

.el-menu-item, .el-sub-menu__title {
  font-weight: bold;
}

.k-avatar {
  margin: auto !important;
}

.k-avatar:hover {
  background-color: #00000000 !important;
}
</style>