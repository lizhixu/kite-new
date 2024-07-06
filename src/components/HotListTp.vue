<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">热门文章</span>
      </div>
    </template>
    <div class="hot-list">
      <el-row :gutter="10" v-for="(article,index) in articleList" :key="index" :class="index>1?'mgt10':''">
        <el-skeleton style="width: 800px" :loading="loading" animated :rows="3">
          <template #template>
            <el-row>
              <el-col :span="8">
                <el-skeleton-item variant="image" style="width: 85px; height: 60px"/>
              </el-col>
              <el-col :span="16">
                <el-skeleton-item variant="text" style="margin-right: 16px"/>
                <el-skeleton-item variant="text" style="width: 40%"/>
              </el-col>
            </el-row>
            <el-divider v-if="index !== articleList.length - 1"/>
          </template>
          <template #default>
            <el-col :span="8">
              <span class="hot-list-num" :class="index<4?('hot-list-num'+(index+1)):''">{{ index + 1 }}</span>
              <router-link :to="`/article_detail/${article.id}`">
                <div class="hot-list-cover">
                  <img class="hot-list-cover img" :src="article.attributes?.img[0]"/>
                </div>
              </router-link>
            </el-col>
            <el-col :span="16">
              <a :href="`/article_detail/${article.id}`" :title="getAttributes(article, 'title')" target="_blank"
                 :underline="false">
                {{ getAttributes(article, 'title') }}
              </a>
            </el-col>
            <el-divider v-if="index !== articleList.length - 1"/>
          </template>
        </el-skeleton>
      </el-row>
    </div>
  </el-card>
</template>

<script setup>
import {ref} from "vue";
import {find} from "@/utils/strapi";
import {extractImagesFromMarkdown, getAttributes} from "@/utils/util";
import _ from "lodash-es";

let loading = ref(true);
const articleList = ref(Array(6).fill({}));
find('articles', {
  sort: 'views:desc',
  filters: {},
  pagination: {
    start: 0,
    limit: 10
  }
}).then((res) => {
  articleList.value = _.slice(_.filter(_.map(res.data, (data) => {
    data.attributes.img = extractImagesFromMarkdown(data.attributes.content)
    return data;
  }), function (o) {
    return o.attributes.img.length > 0;
  }), 0, 6);
  loading.value = false;
});
</script>

<style scoped>
.hot-list {
  font-size: 14px;
}

.hot-list-num {
  position: absolute;
  left: 5px;
  background: #999;
  font-size: 12px;
  color: #fff;
  line-height: 180%;
  margin: 0 8px 0 0;
  padding: 0 5px 1px;
  border-radius: 2px;
  z-index: 1;
}

.hot-list-cover {
  width: 85px;
  height: 60px;
  border-radius: 5px;
  overflow: hidden;
  object-fit: contain;
  border: 1px solid rgb(228 230 235 / 50%);
}

.hot-list-num1 {
  background: #C00;
}

.hot-list-num2 {
  background: #ef8f31;
}

.hot-list-num3 {
  background: #6bd139;
}

.el-divider {
  margin: 5px 0;
}
</style>