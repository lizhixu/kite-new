<template>
  <main>
    <el-row class="main-content">
      <el-col :span="17" class="content">
        <Featured/>
        <Article/>
      </el-col>
      <el-col :span="7" class="sidebar">
        <div class="sidebar__inner">
          <Data/>
          <HotListTp class="mgt10"/>
          <FriendsChain class="mgt10"/>
          <Copyright class="mgt10"/>
        </div>
      </el-col>
    </el-row>
  </main>
</template>
<script setup>
import Article from "@/components/Article.vue";
import Data from "@/components/Data.vue";
import HotListTp from "@/components/HotListTp.vue";
import FriendsChain from "@/components/FriendsChain.vue";
import Copyright from "@/components/Copyright.vue";
import StickySidebar from "sticky-sidebar-v2";

onMounted(() => {
  var sidebar = new StickySidebar('.sidebar', {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '.main-content',
    scrollContainer: '#main-viewport'
  });
})
</script>
<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.el-card {
  --el-card-padding: 15px;
}

.c-s-title {
  font-weight: bold;
  border-bottom: 3px solid #ff5757;
}
.content{
  padding-right: 10px;
}
</style>