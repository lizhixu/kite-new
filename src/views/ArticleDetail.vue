<template>
  <el-row class="main-content">
    <el-col :span="17" class="content">
      <el-card class="box-card">
        <el-skeleton :loading="loading" animated :rows="3">
          <template #template>
            <div style="padding: 14px">
              <el-skeleton-item variant="p" style="width: 20%"/>
              <div class="mgt10">
                <el-skeleton-item variant="h1" style="width: 50%"/>
              </div>
              <div class="mgt10">
                <el-skeleton-item variant="text" style="width: 10%;margin-right: 16px"/>
                <el-skeleton-item variant="text" style="width: 10%"/>
              </div>
              <div class="mgt10">
                <el-skeleton-item variant="image" style="width: 720px; height: 240px"/>
              </div>
              <div class="mgt10">
                <el-skeleton :rows="10"/>
              </div>
            </div>
          </template>
          <template #default>
            <el-breadcrumb :separator-icon="ArrowRight">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ article?.category.data.attributes.name }}</el-breadcrumb-item>
              <el-breadcrumb-item>正文</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="article-detail">
              <div class="article-detail-title">{{ article?.title }}</div>
              <div class="author-info-block">
                <el-row :gutter="20">
                  <el-col :span="3">{{ getAttributes(article?.author?.data, 'username') }}</el-col>
                  <el-col :span="3">
                    <View style="width: 1em;margin-right: 2px;"/>
                    <span>{{ article?.views }}</span>
                  </el-col>
                </el-row>
              </div>
              <div class="article-detail-header mgt10" v-if="data?.lead">{{ data?.lead }}</div>
              <div class="article-viewer markdown-body" v-html="data?.body" ref="article_body"></div>
            </div>

            <div class="privacy_agreement mgt10">
              <div class="privacy_agreement-item" v-show="article?.author.data.attributes.username">
                <p>版权声明：</p>
                <p>作者：{{ article?.author.data.attributes.username }}</p>
                <p>链接：
                  <el-link>{{ curLocation }}</el-link>
                </p>
                <p>文章版权归作者所有，转载请标明出处。</p>
              </div>
            </div>

            <div class="create-desc mgt10">
              最后更新时间：{{ data.articleUpdatedAt }}
            </div>
          </template>
        </el-skeleton>
      </el-card>
      <el-card class="mgt10 page">
        <el-row>
          <el-col :span="10" class="article-detail-next">
            上一篇：
            <router-link :to="`/article_detail/${previous?.id}`" v-if="previous">
              {{ getAttributes(previous, 'title') }}
            </router-link>
            <span v-else>没有上一篇了</span>
          </el-col>
          <el-col :span="4" style="text-align: center">
            <u-divider vertical/>
          </el-col>
          <el-col :span="10" class="article-detail-next">
            下一篇：
            <router-link :to="`/article_detail/${next?.id}`" v-if="next">
              {{ getAttributes(next, 'title') }}
            </router-link>
            <span v-else>没有下一篇了</span>
          </el-col>
        </el-row>
      </el-card>
      <div class="mgt10 mgb50 article-detail-comment">
        <div class="comment-view" style="padding: 0px;z-index: 999;">
          <div class="comment-view-title">评论</div>
          <div id="SOHUCS" :sid="id"></div>
        </div>
      </div>
    </el-col>
    <el-col :span="7" class="sidebar">
      <div class="sidebar__inner">
        <Category :tags="article?.tags.data"/>
        <RecentlyPublished :id="id" :tags="article?.tags.data" class="mgt10"/>
        <el-card class="article-catalog mgt10" v-show="article_anchor?.length > 0">
          <template #header>
            <div class="card-header">
              <span class="c-s-title">目录</span>
            </div>
          </template>
          <el-anchor :offset="70">
            <Anchor :tags="article_anchor" :level="0"/>
          </el-anchor>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script setup>
import '@/assets/markdown.scss'
import {useRoute} from 'vue-router'
import {ArrowRight, View} from '@element-plus/icons-vue'
import StickySidebar from "sticky-sidebar-v2";
import router from "@/router";
import {find, findOne, update} from "@/utils/strapi";
import MarkdownIt from "markdown-it";
import dayjs from "dayjs";
import {inject, nextTick, onMounted, ref} from "vue";
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-light.css';
import MarkdownItGithubHeadings from '@gerhobbelt/markdown-it-github-headings'
import MarkdownItCopy from 'markdown-it-code-copy'
import {findHTags, fremoveHtmlStyle, getAttributes, loadJs} from "@/utils/util";
import {useHead} from "@/hooks/useHead";
import _ from 'lodash-es'
import {changyan_config} from "@/utils/changyan";

const me = inject('me');
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  langPrefix: 'language-',
  highlight: (str) => {
    return hljs.highlightAuto(str).value;
  },
})
md.use(MarkdownItGithubHeadings);
md.use(MarkdownItCopy, {iconClass: 'iconfont icon-Copy', buttonClass: 'copy-button'});
let defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  let aIndex = tokens[idx].attrIndex('target');
  let id = tokens[idx].attrGet('id');
  if (!id || id.indexOf('user-content') === -1) {// 判断是否是锚点
    if (aIndex < 0) {
      tokens[idx].attrPush(['target', '_blank']); // add new attribute
    } else {
      tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
    }
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

const route = useRoute();
const loading = ref(true);
const blogConfig = inject('blogConfig');

const id = route.params.id;
const curLocation = window.location.origin + window.location.pathname;

onMounted(() => {
  new StickySidebar('.sidebar', {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '.main-content',
    scrollContainer: '#main-viewport'
  });
  const slide = document.getElementById(router.currentRoute.value.hash.substring(1))
  if (slide) {
    window.scrollTo(0, slide.offsetTop)
  }
})

const data = ref({
  title: '',
  meta: '',
  lead: '',
  body: ''
})
const article = ref();
findOne('articles', id, {populate: '*'}).then((res) => {
  const attributes = article.value = res.data.attributes;
  const detail_body = md.render(attributes.content);
  data.value = {
    title: attributes.title,
    meta: attributes.author.data.attributes.username,
    views: attributes.author.data.attributes.views,
    lead: attributes.description,
    body: detail_body,
    articleUpdatedAt: dayjs(attributes.articleUpdatedAt).format('YYYY-MM-DD HH:mm')
  }
  loading.value = false;
  useHead({
    title: data.value.title,
    meta: [
      {name: 'description', content: () => data.value.lead || fremoveHtmlStyle(detail_body).slice(0, 50)},
      {name: 'keywords', content: () => _.map(article.value.tags.data, (item) => getAttributes(item, 'name')).join(',')}
    ],
  })
  renderPre();
})
watch(article, (newValue) => {
  update('articles', id, {views: article.value.views + 1})
})

const article_body = ref();
const article_anchor = ref();
watch(article_body, (newValue) => {
  article_anchor.value = findHTags(newValue.querySelectorAll('h1,h2,h3,h4,h5,h6'))
})

//上下篇
const previous = ref();
const next = ref();

function renderPre() {
  const articleUpdatedAt = article.value.articleUpdatedAt;
  find('articles', {
    'sort[0]': 'articleUpdatedAt:desc',
    'filters[articleUpdatedAt][$lt]': articleUpdatedAt,
    'pagination[limit]': 1
  }).then((res) => {
    previous.value = res.data[0];
  })
  find('articles', {
    'sort[0]': 'articleUpdatedAt:asc',
    'filters[articleUpdatedAt][$gt]': articleUpdatedAt,
    'pagination[limit]': 1
  }).then((res) => {
    next.value = res.data[0];
  })
}

nextTick(() => {
  window.changyan = undefined;
  window.cyan = undefined;
  loadJs("https://changyan.sohu.com/upload/changyan.js", () => {
    window.changyan.api.config(changyan_config);
  }, 'changyan_pc_js')
})
</script>

<style scoped>

.article-detail {
  margin-top: 20px;
}

.article-detail-title {
  margin-bottom: 15px;
  font-size: 32px;
  line-height: 32px;
  font-weight: 400;
}

.article-detail-header {
  color: #666;
  font-size: 14px;
  line-height: 22px;
  border: 1px solid #dedede;
  border-radius: 2px;
  background: #f9f9f9;
  padding: 10px;
}

.article-detail-comment {
  background: #ffffff;
  border-radius: 2px;
  padding: 10px;
}

.author-info-block {
  color: #8a919f;
}

.article-detail-next {
  margin: auto;
}

.comment-view-title {
  font-size: 18px;
  line-height: 30px;
  font-weight: 600;
}

.privacy_agreement {
  text-align: justify;
  border-radius: 5px;
  position: relative;
  border: 1px dashed #8cc0f3;
  box-shadow: 0 6px 10px -5px rgba(98, 189, 225, 0.3803921569);
  margin-bottom: 20px;
}

.privacy_agreement-item {
  margin: 0 2px;
  padding: 10px 20px;
  border-radius: 5px;
  background: aliceblue;
}

.privacy_agreement:after {
  content: "";
  display: block;
  width: 31px;
  height: 27px;
  position: absolute;
  background: url(/img.png) 0 0 no-repeat;
  right: 10px;
  bottom: 6px;
  background-size: 100%;
  z-index: 26;
  transform: rotateZ(180deg);
}

.create-desc {
  color: #666666;
}

#SOHUCS #SOHU_MAIN img {
  overflow: hidden !important;
}
</style>