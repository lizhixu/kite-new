<template>
  <el-row class="main-content">
    <el-col :span="17" class="content">
      <el-card class="box-card">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ article?.category.data.attributes.name }}</el-breadcrumb-item>
          <el-breadcrumb-item>正文</el-breadcrumb-item>
        </el-breadcrumb>
        <avue-article id="article" class="article-detail markdown-body" :props="props"
                      :data="data"></avue-article>
        <div class="privacy_agreement mgt10">
          <p>版权声明：</p>
          <p>作者：{{ article?.author.data.attributes.username }}</p>
          <p>链接：
            <el-link>{{ curLocation }}</el-link>
          </p>
          <p>文章版权归作者所有，转载请标明出处。</p>
        </div>

        <div class="create-desc mgt10">
          最后更新时间：{{ data.updatedAt }}
        </div>
      </el-card>
      <el-card class="mgt10 page">
        <el-row>
          <el-col :span="10">
            上一篇：
            <router-link to="">
              每当白日依山尽，夕阳余辉便透过朵朵
            </router-link>
          </el-col>
          <el-col :span="4" style="text-align: center">
            <u-divider vertical/>
          </el-col>
          <el-col :span="10">
            下一篇：
            <router-link to="">
              每当白日依山尽，夕阳余辉便透过朵朵云层
            </router-link>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="mgt10" id="comment">
        <div class="comment-view" style="padding: 0px">
          <u-comment :config="config" :show-size="2" @submit="submit" @like="like" @remove="remove" @report="report">
            <!-- <template #list-title>全部评论</template> -->
          </u-comment>
        </div>
      </el-card>
    </el-col>
    <el-col :span="7" class="sidebar">
      <div class="sidebar__inner">
        <Category/>
        <el-card class="article-catalog mgt10">
          <template #header>
            <div class="card-header">
              <span class="c-s-title">目录</span>
            </div>
          </template>
          <u-anchor container="#article"></u-anchor>
        </el-card>
        <RecentlyPublished class="mgt10"/>
      </div>
    </el-col>
  </el-row>
</template>
<script setup>
import 'github-markdown-css/github-markdown-light.css'
import {useRoute} from 'vue-router'
import {ArrowRight} from '@element-plus/icons-vue'
import {UToast} from 'undraw-ui'
import emoji from '@/emoji'
import StickySidebar from "sticky-sidebar-v2";
import router from "@/router";
import {findOne} from "@/utils/strapi";
import MarkdownIt from "markdown-it";
import dayjs from "dayjs";
import {ref} from "vue";

const md = new MarkdownIt()
const route = useRoute();
let loading = ref(true);

const id = route.params.id;
const curLocation = window.location.href;

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
const props = ref({
  title: 'title',
  meta: 'meta',
  lead: 'lead',
  body: 'body'
})
const article = ref();
findOne('articles', id, {populate: '*'}).then((res) => {
  const attributes = article.value = res.data.attributes;
  data.value = {
    title: attributes.title,
    meta: attributes.author.data.attributes.username,
    lead: attributes.description,
    body: md.render(attributes.content),
    updatedAt: dayjs(attributes.updatedAt).format('YYYY-MM-DD HH:mm:ss')
  }
})
var config = reactive({
  user: {
    id: '1',
    username: 'user',
    avatar: 'https://static.juzicon.com/avatars/avatar-200602130320-HMR2.jpeg?x-oss-process=image/resize,w_100',
    // 评论id数组 建议:存储方式用户id和文章id和评论id组成关系,根据用户id和文章id来获取对应点赞评论id,然后加入到数组中返回
    likeIds: ['1', '2', '11']
  },
  emoji: emoji,
  comments: []
});

//获取文件url
function createObjectURL(blob) {
  if (window.URL) {
    return window.URL.createObjectURL(blob);
  } else if (window.webkitURL) {
    return window.webkitURL.createObjectURL(blob);
  } else {
    return '';
  }
}

var temp_id = 100;
// 提交评论事件
var submit = function (_a) {
  var content = _a.content, parentId = _a.parentId, files = _a.files, finish = _a.finish;
  console.log('提交评论: ' + content, parentId, files);
  /**
   * 上传文件后端返回图片访问地址，格式以', '为分割; 如:  '/static/img/program.gif, /static/img/normal.webp'
   */
  var contentImg = files.map(function (e) {
    return createObjectURL(e);
  }).join(', ');
  var comment = {
    id: String((temp_id += 1)),
    parentId: parentId,
    uid: config.user.id,
    address: '来自江苏',
    content: content,
    likes: 0,
    createTime: '1分钟前',
    contentImg: contentImg,
    user: {
      username: config.user.username,
      avatar: config.user.avatar,
      level: 6,
      homeLink: "/" + (temp_id += 1)
    },
    reply: null
  };
  setTimeout(function () {
    finish(comment);
    UToast({message: '评论成功!', type: 'info'});
  }, 200);
};
// 删除评论
var remove = function (id, finish) {
  setTimeout(function () {
    finish();
    alert("\u5220\u9664\u6210\u529F: " + id);
  }, 200);
};
//举报用户
var report = function (id, finish) {
  console.log(id);
  setTimeout(function () {
    finish();
    alert("\u4E3E\u62A5\u6210\u529F: " + id);
  }, 200);
};
// 点赞按钮事件
var like = function (id, finish) {
  console.log(id);
  setTimeout(function () {
    finish();
  }, 200);
};
config.comments = [
  {
    id: '1',
    parentId: null,
    uid: '1',
    address: '来自上海',
    content: '缘生缘灭，缘起缘落，我在看别人的故事，别人何尝不是在看我的故事?别人在演绎人生，我又何尝不是在这场戏里?谁的眼神沧桑了谁?我的眼神，只是沧桑了自己[喝酒]',
    likes: 2,
    contentImg: '/static/img/program.gif, /static/img/normal.webp',
    createTime: '1分钟前',
    user: {
      username: '落🤍尘',
      avatar: 'https://static.juzicon.com/avatars/avatar-200602130320-HMR2.jpeg?x-oss-process=image/resize,w_100',
      level: 6,
      homeLink: '/1'
    }
  },
  {
    id: '2',
    parentId: null,
    uid: '2',
    address: '来自苏州',
    content: '知道在学校为什么感觉这么困吗？因为学校，是梦开始的地方。[脱单doge]',
    likes: 11,
    createTime: '1天前',
    user: {
      username: '悟二空',
      avatar: 'https://static.juzicon.com/user/avatar-bf22291e-ea5c-4280-850d-88bc288fcf5d-220408002256-ZBQQ.jpeg',
      level: 1,
      homeLink: '/2'
    },
    reply: {
      total: 2,
      list: [
        {
          id: '21',
          parentId: '2',
          uid: '3',
          address: '来自重庆',
          content: '说的对，所以，综上所述，上课睡觉不怪我呀💤',
          likes: 3,
          createTime: '1分钟前',
          user: {
            username: '别扰我清梦*ぁ',
            avatar: 'https://static.juzicon.com/user/avatar-8b6206c1-b28f-4636-8952-d8d9edec975d-191001105631-MDTM.jpg?x-oss-process=image/resize,m_fill,w_100,h_100',
            level: 5,
            homeLink: '/21'
          }
        },
        {
          id: '22',
          parentId: '2',
          uid: '4',
          content: '回复 <span style="color: var(--u-color-success-dark-2);">@别扰我清梦*ぁ:</span> 看完打了一个哈切。。。会传染。。。[委屈]',
          address: '来自广州',
          likes: 9,
          createTime: '1天前',
          user: {
            username: 'Blizzard',
            avatar: 'https://static.juzicon.com/user/avatar-3cb86a0c-08e7-4305-9ac6-34e0cf4937cc-180320123405-BCV6.jpg?x-oss-process=image/resize,m_fill,w_100,h_100',
            level: 3,
            homeLink: '/22'
          }
        }
      ]
    }
  }
];

</script>

<style scoped>
.article-detail {
  margin-top: 20px;
}

.u-comment {
  padding: 0;
  margin-top: -30px;
}

.privacy_agreement {
  text-align: justify;
  border-radius: 8px;
  position: relative;
  background: #f2f4fc;
  padding: 15px;
  margin-bottom: 20px;
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
</style>
<style>
.markdown-body, .avue-article__body, .avue-comment__body {
  font-family: "JetBrainsMono-Medium" !important;
}
</style>