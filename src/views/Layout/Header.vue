<template>
  <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
      class="pd150"
      active-text-color	="#5cb9ff"
  >
    <el-menu-item index="0">
      <img src="https://dd-static.jd.com/ddimg/jfs/t1/123081/3/31365/30273/6344cf2eEdce44449/311b5af8818e5895.png"
           alt="" style="width: 56px;">
    </el-menu-item>
    <el-menu-item index="1">首页</el-menu-item>
    <el-menu-item index="3">专栏</el-menu-item>
    <div class="flex-grow"/>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item>
      <el-icon :size="20">
        <Edit />
      </el-icon>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import {ref} from 'vue'

const activeIndex = ref('1')
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
</style>