<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="8" v-for="(article,index) in articleList" class="feat-list"
              :class="(index>2?'brsd pgt10':'brsd bbsd') + ((index+1)%3 === 0?' brsdh':'')">
        <el-skeleton style="width: 240px" :loading="loading" animated :rows="3">
          <template #default>
            <article class="guide-inner top-num0">
              <div class="guide-inner-info">
                <div class="g-i-top">
                  <span class="g-i-cate">
                      <el-tag>{{ getAttributes(article, 'category').data.attributes.name }}</el-tag>
                  </span>
                  <span class="g-i-time"><Clock
                      style="width: 1em;"/>{{ dayjs(getAttributes(article, 'articleUpdatedAt')).format('YYYY-MM-DD') }}</span>
                </div>
                <h5>
                  <router-link :to="'/article_detail/'+article.id" class="normal">{{ getAttributes(article, 'title') }}
                  </router-link>
                </h5>
                <u-fold line="1">
                  <p>{{
                      getAttributes(article, 'description') || fremoveHtmlStyle(md.render(getAttributes(article, 'content')))
                    }}</p>
                </u-fold>
              </div>
            </article>
          </template>
        </el-skeleton>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import {ref} from "vue";
import {find} from "@/utils/strapi";
import MarkdownIt from "markdown-it";
import {fremoveHtmlStyle, getAttributes} from "@/utils/util";
import dayjs from "dayjs";
import {useCategoryStore} from "@/stores/category";

const md = new MarkdownIt()
const category = useCategoryStore();

let loading = ref(true);
const articleList = ref(Array(6).fill({}));
find('articles', {
  populate: '*',
  sort: 'articleUpdatedAt:desc',
  filters: {
    chosen: {
      '$eq': true
    }
  },
  pagination: {
    start: 0,
    limit: 6
  }
}).then((res) => {
  articleList.value = res.data;
  loading.value = false;
});
</script>

<style scoped>
.feat-list {
  padding: 5px;
}

.g-i-time {
  float: right;
  font-size: 12px;
  color: #777;
  padding-right: 10px;
}

.guide-inner-info > h5, p {
  margin: 5px;
}

.guide-inner-info p {
  color: #777;
  height: 44px;
  line-height: 22px;
  overflow: hidden;
  font-size: 12px;
  margin-top: 6px;
  text-align: justify;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
}

.normal {
  font-size: 15px;
  height: 25px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.normal :hover {
  color: #0089ff;
}
</style>