<script setup>
import CategoryLabel from "@/components/CategoryLabel.vue";
import {onMounted, ref, watch} from "vue";
import {getBaikeItem} from "@/utils/toolkit"
import TagCard from "@/components/TagCard.vue";
import router from "@/router";
import Article from "@/components/Article.vue";
import StickySidebar from "sticky-sidebar-v2";
import {useHead} from "@/hooks/useHead";
import {useRoute} from "vue-router";

const route = useRoute();
const articleRef = ref();
const query = ref();
const tags = ref({})
const articleParams = ref({});

watch(
    () => router.currentRoute.value,
    (newRoute) => {
      query.value = newRoute.query;
      articleParams.value = {
        populate: '*',
        'filters[tags][$eq]': query.value?.id,
        sort: 'articleUpdatedAt:desc'
      };
      tags.value = {};
      getBkitem();
      articleRef.value?.getArticle?.();
      const name = query.value.name;
      useHead({
        title: name + route.meta?.title,
        meta: [
          {name: 'description', content: name},
          {name: 'keywords', content: name}
        ],
      })
    },
    {immediate: true}
)

function getBkitem() {
  getBaikeItem(query.value.name).then(res => {
    const data = res.data;
    tags.value = {
      id: data.id,
      title: query.value.name,
      description: data.abstract,
      detailLink: data.url,
      articleCount: 42,
      image: data.image ? `https://image.baidu.com/search/down?url=${data.image}` : ''
    }
  })
}

onMounted(() => {
  new StickySidebar('.sidebar', {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '.main-content',
    scrollContainer: '#main-viewport'
  });
})
</script>

<template>
  <div class="main-content">
    <div class="content mgb50" style="width: 800px;display: inline-block">
      <TagCard
          :tag="tags"
      />
      <Article ref="articleRef" :show-total="true" :article-params="articleParams"/>
    </div>
    <div class="sidebar" style="width: 300px;float: right">
      <div class="sidebar__inner">
        <CategoryLabel/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sub-warning-icon {
  position: relative;
}
</style>