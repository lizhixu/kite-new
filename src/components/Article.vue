<template>
  <div v-for="(article,index) in articleList" :key="index">
    <el-skeleton style="width: 800px" :loading="loading" animated :rows="3">
      <template #template>
        <el-card class="box-card mgt10">
          <div style="padding: 14px">
            <el-skeleton-item variant="h3" style="width: 50%"/>
            <div style="display: flex;align-items: center;margin-top: 16px;height: 16px;">
              <el-skeleton-item variant="text" style="margin-right: 16px"/>
              <el-skeleton-item variant="text" style="width: 30%"/>
            </div>
            <el-skeleton-item variant="text" style="margin-top: 16px;width: 70%"/>
            <el-skeleton-item variant="text" style="margin-top: 16px;width: 80%"/>
          </div>
        </el-card>
      </template>
      <template #default>
        <el-card class="box-card mgt10" v-if="article.attributes.img.length > 0">
          <el-row :gutter="30">
            <el-col :span="7">
              <a :href="'/article_detail/'+article.id" :title="article.attributes.title" target="_blank">
                <div class="article-list-img">
                  <img class="img article-list-img"
                       :src="article.attributes.img[0]" :alt="article.attributes.title"/>
                </div>
              </a>
            </el-col>
            <el-col :span="17">
              <div class="start-cover"
                   :style="{'background-image':`url(${cdn_domain + category.categories[article.attributes.category.data.id].attributes.picture.data.attributes.url})`}"></div>
              <a :href="'/article_detail/'+article.id" :title="article.attributes.title" target="_blank"
                 class="article-title">
                {{ article.attributes.title }}
              </a>
              <u-fold line="3" class="article-desc">
                <p>{{ article.attributes.description || fremoveHtmlStyle(md.render(article.attributes.content)) }}</p>
              </u-fold>
              <el-row :gutter="10" class="article-detail">
                <el-col :span="6">
                  <span><Clock style="width: 1em;"/>{{
                      dayjs(article.attributes.articleUpdatedAt).format('YYYY-MM-DD')
                    }}</span>
                </el-col>
                <el-col :span="5">
                  <span><View style="width: 1em;"/>{{ article.attributes.views }}阅读</span>
                </el-col>
                <el-col :span="5">
                  <a :href="'/article_detail/'+article.id +'#comment'" target="_blank" class="article-detail-a">
                    <ChatRound style="width: 1em;"/>
                    <span>{{ article.attributes.comments }}评论</span>
                  </a>
                </el-col>
                <el-col :span="8" class="article-author">
                  <el-link :underline="false">
                    {{ getAttributes(getAttributes(article, 'author').data, 'username') }}
                  </el-link>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card mgt10" v-else>
          <div class="start-cover start-cover-2"
               :style="{'background-image':`url(${cdn_domain + category.categories[article.attributes.category.data.id].attributes.picture.data.attributes.url})`}"></div>
          <a :href="'/article_detail/'+article.id" target="_blank" :title="article.attributes.title"
             class="article-title" style="width: 550px">
            {{ article.attributes.title }}
          </a>
          <u-fold line="3" class="article-desc">
            <p>{{ article.attributes.description || fremoveHtmlStyle(md.render(article.attributes.content)) }}</p>
          </u-fold>
          <el-row :gutter="10" class="article-detail">
            <el-col :span="6">
              <span><Clock style="width: 1em;"/>{{
                  dayjs(article.attributes.articleUpdatedAt).format('YYYY-MM-DD')
                }}</span>
            </el-col>
            <el-col :span="5">
              <span><View style="width: 1em;"/>{{ article.attributes.views }}阅读</span>
            </el-col>
            <el-col :span="5">
              <a :href="'/article_detail/'+article.id +'#comment'" target="_blank" class="article-detail-a">
                <ChatRound style="width: 1em;"/>
                <span>{{ article.attributes.comments }}评论</span>
              </a>
            </el-col>
            <el-col :span="8" class="article-author">
              <el-link :underline="false">
                {{ getAttributes(getAttributes(article, 'author').data, 'username') }}
              </el-link>
            </el-col>
          </el-row>
        </el-card>
      </template>
    </el-skeleton>
  </div>
  <el-divider v-if="totalPage -1 === page">到底线了</el-divider>
</template>

<script setup>
import {find} from "@/utils/strapi";
import {ref} from "vue";
import _ from 'lodash-es'
import {extractImagesFromMarkdown, fremoveHtmlStyle, getAttributes} from "@/utils/util";
import MarkdownIt from "markdown-it";
import {useCategoryStore} from "@/stores/category";
import dayjs from "dayjs";

const cdn_domain = import.meta.env.VITE_CDN_DOMAIN;
const md = new MarkdownIt()

let loading = ref(true);
const articleList = ref(Array(4).fill({}));
let page = 0;
const pageSize = 10;
let totalPage = 1;

function getArticle() {
  find('articles', {
    populate: '*',
    filters: {},
    sort: 'articleUpdatedAt:desc',
    pagination: {start: page * pageSize, limit: pageSize}
  }).then((res) => {
    const tmpList = _.map(res.data, (data) => {
      data.attributes.img = extractImagesFromMarkdown(data.attributes.content)
      return data;
    })
    if (tmpList.length === 0) return;
    if (page === 0) {
      totalPage = Math.ceil(res.meta.pagination.total / pageSize);
      articleList.value = tmpList
    } else {
      articleList.value.push(...tmpList);
    }
    loading.value = false;
    nextLoad = false;
  });
}

getArticle();
const category = useCategoryStore();
let docEl = document.documentElement;
// 浏览器可视部分的高度
let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
let nextLoad = false;
window.addEventListener('scroll', () => {
  // 页面中内容的总高度
  let docELHeight = docEl.scrollHeight;
  // 页面内已经滚动的距离
  let scrollTop = docEl.scrollTop;
  // 页面上滚动到底部的条件
  if (Math.ceil(scrollTop) >= docELHeight - clientHeight && !nextLoad && totalPage - 1 >= page) {
    // 页面内已经滚动的距离 = 页面中内容的总高度 - 浏览器可视部分的高度
    console.log('到达底部了！');
    page++;
    if (totalPage - 1 >= page) {
      nextLoad = true;
      getArticle();
    }
  }
});
</script>
<style scoped>
.article-page {
  display: flex;
  flex-direction: column;
}

.article-title {
  width: 400px;
  text-decoration: none;
  display: block;
  font-size: 18px;
  font-weight: bold;
  line-height: 26px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.article-title :hover {
  color: #0089ff;
}

.article-title :active {
  color: #aaaa;
}

.article-list-img {
  width: 205px;
  height: 150px;
  border-radius: 5px;
  overflow: hidden;
  object-fit: contain;
  border: 1px solid rgb(228 230 235 / 50%);
}

.article-desc {
  line-height: 28px;
}

.start-cover {
  height: 50px;
  margin: -15px -30px -35px 0;
  background-size: 100% auto;
  background-repeat: no-repeat;
}

.start-cover-2 {
  background-size: auto 38px;
  background-position: top right;
}

.article-detail {
  color: #666;
}

.article-detail-a {
  color: #666;
}

.article-author {
  text-align: right;
}
</style>