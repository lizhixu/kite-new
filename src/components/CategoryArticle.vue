<template>
  <el-skeleton :loading="loading" animated :rows="2">
    <template #template>
      <el-card class="box-card">
        <div style="padding: 14px">
          <el-skeleton-item variant="h3" style="width: 50%"/>
          <div style="display: flex;align-items: center;margin-top: 16px;height: 16px;">
            <el-skeleton-item variant="text" style="margin-right: 16px"/>
            <el-skeleton-item variant="text" style="width: 30%"/>
          </div>
          <el-skeleton-item variant="text" style="margin-top: 16px;width: 70%"/>
        </div>
      </el-card>
    </template>
    <template #default>
      <div v-if="articleList?.length > 0">
        <el-card class="box-card" :class="index > 0 ? 'mgt10' : ''" v-for="(article, index) in articleList"
                 :key="article.id">
          <el-row :gutter="30">
            <el-col>
              <div class="start-cover"></div>
              <a :href="`/article_detail/${article.id}`" target="_blank" class="article-title">
                {{ getAttributes(article, 'title') }}
              </a>
              <u-fold line="2" class="article-desc">
                <p>{{
                    getAttributes(article, 'description') || fremoveHtmlStyle(md.render(getAttributes(article,
                        'content')))
                  }}</p>
              </u-fold>
              <el-row :gutter="10" class="article-detail">
                <el-col :span="6">
                  <span>
                    <Clock style="width: 1em;"/>{{
                      dayjs(article.attributes.articleUpdatedAt).format('YYYY-MM-DD')
                    }}
                  </span>
                </el-col>
                <el-col :span="5">
                  <span>
                    <View style="width: 1em;"/>{{ article.attributes.views }}阅读
                  </span>
                </el-col>
                <el-col :span="5">
                  <a :href="`/article_detail/${article.id}#comment`" target="_blank" class="article-detail-a">
                    <ChatRound style="width: 1em;"/>
                    <span :id="`sourceId::${article.id}`" class="cy_cmt_count"></span>
                    <span>评论</span>
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
        <div class="mgt10 mgb10 article-page">
          <el-pagination :page-size="pageSize" :page-count="totalPage" :current-page="Number(page)" :hide-on-single-page="true"
                         @size-change="handleSizeChange" @current-change="handleCurrentChange" background
                         layout="prev, pager, next"
                         style="align-self: center;"/>
        </div>
      </div>
      <div v-else>
        <UEmpty description="暂无文章"/>
      </div>
    </template>
  </el-skeleton>
</template>

<script setup>
import {find} from "@/utils/strapi";
import _ from "lodash-es";
import {extractImagesFromMarkdown, fremoveHtmlStyle, getAttributes} from "@/utils/util";
import {nextTick, ref} from "vue";
import MarkdownIt from "markdown-it";
import UEmpty from "@/components/common/UEmpty.vue";
import dayjs from "dayjs";
import {loadCommentCount} from "@/utils/changyan";

const md = new MarkdownIt()
const props = defineProps(['id', 'cur_page'])

const loading = ref(true);
const page = ref(props.cur_page || 1);
const totalPage = ref(0);
const pageSize = 20;
const articleList = ref();

function renderArticle(id) {
  history.pushState({}, '', `/special/${id}?page=${page.value}`);
  find('articles', {
    populate: '*',
    'filters[category][id][$eq]': id,
    sort: 'articleUpdatedAt:desc',
    pagination: {start: (page.value - 1) * pageSize, limit: pageSize}
  }).then((res) => {
    const tmpList = _.map(res.data, (data) => {
      data.attributes.img = extractImagesFromMarkdown(data.attributes.content)
      return data;
    })
    loading.value = false;
    if (tmpList.length === 0) return;
    totalPage.value = Math.ceil(res.meta.pagination.total / pageSize);
    articleList.value = tmpList

    nextTick(() => loadCommentCount())
  });
}

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val) => {
  page.value = val;
  articleList.value = {};
  loading.value = true;
  renderArticle(props.id)
}

watch(props, () => {
  handleCurrentChange(1);
})

onMounted(() => {
  renderArticle(props.id)
})
</script>
<style scoped>
.article-page {
  display: flex;
  flex-direction: column;
}

.article-title {
  width: 460px;
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

.article-desc {
  font-size: 14px;
  margin-top: -10px;
}

.start-cover {
  height: 50px;
  margin: -15px 0 -35px 0;
  background-size: 100% auto;
  background-repeat: no-repeat;
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