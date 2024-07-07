<template>
  <el-card class="box-card" :class="index > 0 ? 'mgt10' : ''"
           v-for="(article,index) in articleList" :key="article.id">
    <el-row :gutter="30">
      <el-col>
        <div class="start-cover"></div>
        <a :href="'/article_detail/'" class="article-title">
          {{ getAttributes(article, 'title') }}
        </a>
        <u-fold line="2" class="article-desc">
          <p>{{
              getAttributes(article, 'description') || fremoveHtmlStyle(md.render(getAttributes(article, 'content')))
            }}</p>
        </u-fold>
        <el-row :gutter="10" class="article-detail">
          <el-col :span="6">
            <span><Clock style="width: 1em;"/>2022-09-08</span>
          </el-col>
          <el-col :span="5">
            <span><View style="width: 1em;"/>100阅读</span>
          </el-col>
          <el-col :span="5">
            <a :href="`/article_detail/${article.id}#comment`" class="article-detail-a">
              <ChatRound style="width: 1em;"/>
              <span>100评论</span>
            </a>
          </el-col>
          <el-col :span="8" class="article-author">
            <el-avatar style="width: 25px;height: 25px;margin-right: 3px;"
                       src="https://picx.zhimg.com/v2-c723c96636425aec5c56429abfb30d49_1440w.jpeg?source=d16d100b"
            />
            <el-link :underline="false">JacyLi</el-link>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
  <div class="mgt10 mgb10 article-page">
    <el-pagination background layout="prev, pager, next" :total="1000" style="align-self: center;"/>
  </div>
</template>

<script setup>
import {find} from "@/utils/strapi";
import _ from "lodash-es";
import {extractImagesFromMarkdown, fremoveHtmlStyle, getAttributes} from "@/utils/util";
import {ref} from "vue";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt()
const props = defineProps(['id'])

const page = ref(1);
const totalPage = ref(0);
const pageSize = 10;
const articleList = ref(Array(4).fill({}));

function renderArticle(id) {
  history.pushState({}, '', `/special/${id}`);
  find('articles', {
    populate: '*',
    'filters[[category][id]][$eq]': id,
    sort: 'articleUpdatedAt:desc',
    pagination: {start: page.value * pageSize, limit: pageSize}
  }).then((res) => {
    const tmpList = _.map(res.data, (data) => {
      data.attributes.img = extractImagesFromMarkdown(data.attributes.content)
      return data;
    })
    if (tmpList.length === 0) return;
    if (page.value === 1) {
      totalPage.value = Math.ceil(res.meta.pagination.total / pageSize);
      articleList.value = tmpList
    } else {
      articleList.value.push(...tmpList);
    }
  });
}

watch(props, (newVal) => {
  renderArticle(newVal.id)
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

.article-author > a {
  margin-top: -15px;
}
</style>