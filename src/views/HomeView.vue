<template>
  <main>
    <div class="main-content">
      <div class="content mgb50" style="width: 800px;display: inline-block">
        <Featured />
        <Article />
      </div>
      <div class="sidebar" style="width: 300px;float: right">
        <div class="sidebar__inner">
          <WxCode />
          <HotListTp class="mgt10" />
          <FriendsChain class="mgt10" />
          <Copyright class="mgt10" />
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import Featured from "@/components/Featured.vue";
import Article from "@/components/Article.vue";
import HotListTp from "@/components/HotListTp.vue";
import FriendsChain from "@/components/FriendsChain.vue";
import Copyright from "@/components/Copyright.vue";
import WxCode from "@/components/WxCode.vue";
import StickySidebar from "sticky-sidebar-v2";
import { onMounted, inject } from "vue";
import { useHead } from "@/hooks/useHead";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(() => {
  new StickySidebar('.sidebar', {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '.main-content',
    scrollContainer: '#main-viewport'
  });
})

const blogConfig = inject('blogConfig');
useHead({
  title: route.meta?.title,
  meta: [
    { name: 'description', content: blogConfig?.seo.description },
    { name: 'keywords', content: blogConfig?.seo.keywords },
  ],
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