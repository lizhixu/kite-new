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
              <router-link :to="'/article_detail/'+article.id">
                <div class="article-list-img">
                  <img class="img article-list-img"
                       :src="article.attributes.img[0]" :alt="article.attributes.title"/>
                </div>
              </router-link>
            </el-col>
            <el-col :span="17">
              <div class="start-cover"
                   :style="{'background-image':`url(${api_url + category.categories[article.attributes.category.data.id].attributes.picture.data.attributes.url})`}"></div>
              <router-link :to="'/article_detail/'+article.id" class="article-title">
                {{ article.attributes.title }}
              </router-link>
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
                  <router-link :to="'/article_detail/'+article.id +'#comment'" class="article-detail-a">
                    <ChatRound style="width: 1em;"/>
                    <span>{{ article.attributes.comments }}评论</span>
                  </router-link>
                </el-col>
                <el-col :span="8" class="article-author">
                  <el-avatar style="width: 25px;height: 25px;margin-right: 3px;"
                             src="//p3-passport.byteimg.com/img/user-avatar/cb1d6d812c74b1540552190d2429e81d~180x180.awebp"
                  />
                  <el-link :underline="false">JacyLi</el-link>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card mgt10" v-else>
          <div class="start-cover start-cover-2"
               :style="{'background-image':`url(${api_url + category.categories[article.attributes.category.data.id].attributes.picture.data.attributes.url})`}"></div>
          <router-link :to="'/article_detail/'+article.id" class="article-title" style="width: 550px">
            {{ article.attributes.title }}
          </router-link>
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
              <router-link :to="'/article_detail/'+article.id +'#comment'" class="article-detail-a">
                <ChatRound style="width: 1em;"/>
                <span>{{ article.attributes.comments }}评论</span>
              </router-link>
            </el-col>
            <el-col :span="8" class="article-author">
              <el-avatar style="width: 25px;height: 25px;margin-right: 3px;"
                         src="//p3-passport.byteimg.com/img/user-avatar/cb1d6d812c74b1540552190d2429e81d~180x180.awebp"
              />
              <el-link :underline="false">JacyLi</el-link>
            </el-col>
          </el-row>
        </el-card>
      </template>
    </el-skeleton>
  </div>
  <div class="mgt10 mgb10 article-page" v-if="hasMore">
    <el-pagination background layout="prev, pager, next" :total="1000" style="align-self: center;"/>
  </div>
</template>

<script setup>
import {find} from "@/utils/strapi";
import {ref} from "vue";
import _ from 'lodash'
import {extractImagesFromMarkdown, fremoveHtmlStyle} from "@/utils/util";
import MarkdownIt from "markdown-it";
import {useCategoryStore} from "@/stores/category";
import dayjs from "dayjs";

const api_url = import.meta.env.VITE_API_URL;
const md = new MarkdownIt()

let loading = ref(true);
let hasMore = ref(false);
const articleList = ref(Array(4).fill({}));
find('articles', {
  populate: '*',
  filters: {},
  sort: 'articleUpdatedAt:desc',
  pagination: {
    start: 0,
    limit: 20
  }
}).then((res) => {
  articleList.value = _.map(res.data, (data) => {
    data.attributes.img = extractImagesFromMarkdown(data.attributes.content)
    return data;
  });
  loading.value = false;
});
const category = useCategoryStore();
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
}

.article-desc {
  line-height: 28px;
}

.start-cover {
  height: 50px;
  margin: -15px -30px -35px 0;
  /*background-image: url(//ttfou.com/images/2022/10/14/f76944211232b03289ab30dcb8e841c0.png);*/
  /*background-image: url(//ttfou.com/images/2022/10/14/4d87388bf56266cd39af0ea1170ab64c.png);*/
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

.article-author > a {
  margin-top: -15px;
}
</style>