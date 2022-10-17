<template>
  <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
      class="pd150 k-header"
      active-text-color="#5cb9ff" :router="true"
  >
    <el-menu-item class="logo">
      <router-link to="/">
        <img src="https://ttfou.com/images/2022/10/17/0e466ab23365717fd6861bbb621d4f8b.png"
             alt="" style="width: 50px;">
      </router-link>
    </el-menu-item>
    <el-menu-item index="/">首页</el-menu-item>
    <el-sub-menu index="2">
      <template #title>专栏</template>
      <el-menu-item index="/special/php">PHP</el-menu-item>
      <el-menu-item index="/special/golang">Go</el-menu-item>
      <el-menu-item index="/special/vuejs">VueJs</el-menu-item>
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
      <el-avatar src="//tvax4.sinaimg.cn/crop.0.0.996.996.1024/e318a1b0ly8ggeuuuuuofj20ro0rotbk.jpg"></el-avatar>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import {ref} from 'vue'

const activeIndex = ref('/')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<style>
.flex-grow {
  flex-grow: 1;
}

.el-header {
  --el-header-padding: 0px;
}

.k-header {
  box-shadow: 0px 5px 40px 0px rgb(17 58 93 / 10%);
  background-color: rgba(255, 255, 255, .96);
  background-image: url(//dahaihao.com/zb_users/theme/hopelee/style/images/top-fr-bg.png);
  background-position: center right;
  background-size: auto 100%;
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