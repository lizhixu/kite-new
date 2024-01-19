<template>
  <main>
    <div class="main-content">
      <div class="content" style="width: 800px;display: inline-block">
        <Featured/>
        <Article/>
      </div>
      <div class="sidebar" style="width: 300px;float: right">
        <div class="sidebar__inner">
          <!--          <u-search :config="config" @submit="submit"></u-search>-->
          <WxCode/>
          <HotListTp class="mgt10"/>
          <FriendsChain class="mgt10"/>
          <Copyright class="mgt10"/>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import Article from "@/components/Article.vue";
import HotListTp from "@/components/HotListTp.vue";
import FriendsChain from "@/components/FriendsChain.vue";
import Copyright from "@/components/Copyright.vue";
import StickySidebar from "sticky-sidebar-v2";
import WxCode from "@/components/WxCode.vue";
import {ref} from "vue";

const config = ref({
  keywords: ['斗罗大陆', '斗破苍穹', '吞噬星空', '凡人修仙传', '一念永恒'],
  hotSearchList: [
    '斗罗大陆',
    '斗破苍穹',
    '吞噬星空',
    '凡人修仙传',
    '一念永恒',
    '完美世界',
    '鬼灭之刃',
    '间谍过家家',
    '武动乾坤',
    '神印王座'
  ] // top10 热门搜索 最多显示10条数据
});
const submit = function (val) {
  console.log(val);
  window.open('/all?keyword=' + val);
};
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
  text-shadow: 2px 2px 3px #9f9b9b;
}

.u-search {
  width: auto !important;
}

.card-box {
  background: #ffffff;
  width: 310px !important;
}
</style>