<template>
  <el-row class="main-content">
    <el-col :span="17" class="content">
      <el-card class="box-card">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>PHP</el-breadcrumb-item>
          <el-breadcrumb-item>正文</el-breadcrumb-item>
        </el-breadcrumb>
        <avue-article id="article" class="article-detail" :props="props"
                      :data="data"></avue-article>
        <div class="privacy_agreement mgt10">
          <p>版权声明：</p>
          <p>作者：德玛西亚</p>
          <p>链接：xxx</p>
          <p>文章版权归作者所有，转载请标明出处。</p>
        </div>

        <div class="create-desc mgt10">
          最后更新时间：2022年10月17日 14:23:05
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
            <u-divider vertical /></el-col>
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
        <RecentlyPublished class="mgt10"/>
        <el-card class="article-catalog mgt10">
          <template #header>
            <div class="card-header">
              <span class="c-s-title">目录</span>
            </div>
          </template>
          <u-anchor container="#article"></u-anchor>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script setup>
import {ArrowRight} from '@element-plus/icons-vue'
import {UToast} from 'undraw-ui'
import emoji from '@/emoji'
import StickySidebar from "sticky-sidebar-v2";
import router from "@/router";

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
  title: '永远的蝴蝶',
  meta: '陈启佑（台湾）',
  lead: '《永远的蝴蝶》是台湾著名作家陈启佑先生的一篇小小说。这是一篇散文化的微型小说，其语言具有较强的抒情色彩，立意含蓄隽永 。作品情节很简单，写的是一个凄美的爱情故事。在一个雨天，“我”的恋人樱子自愿帮“我”到马路对面去寄信。随着一阵拔尖的刹车声，樱子年轻的生命消逝了。',
  body: `<h2>哈哈哈</h2><p>那时候刚好下着雨，柏油路面湿冷冷的，还闪烁着青、黄、红颜色的灯火。我们就在骑楼下躲雨，看绿色的邮筒孤独地站在街的对面。我白色风衣的大口袋里有一封要寄给南部的母亲的信。樱子说她可以撑伞过去帮我寄信。我默默点头。</p>
                <p>“谁叫我们只带来一把小伞哪。”她微笑着说，一面撑起伞，准备过马路帮我寄信。从她伞骨渗下来的小雨点，溅在我的眼镜玻璃上。</p>
                <p>随着一阵拔尖的煞车声，樱子的一生轻轻地飞了起来。缓缓地，飘落在湿冷的街面上，好像一只夜晚的蝴蝶。</p>
                <p>虽然是春天，好像已是秋深了。</p>
                <p>她只是过马路去帮我寄信。这简单的行动，却要叫我终身难忘了。我缓缓睁开眼，茫然站在骑楼下，眼里裹着滚烫的泪水。世上所有的车子都停了下来，人潮涌向马路中央。没有人知道那躺在街面的，就是我的，蝴蝶。这时她只离我五公尺，竟是那么遥远。更大的雨点溅在我的眼镜上，溅到我的生命里来。</p>
                <h2>呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵</h2>
                <p>为什么呢？只带一把雨伞？</p>
                <h3>sdasds</h3>
                <p>然而我又看到樱子穿着白色的风衣，撑着伞，静静地过马路了。她是要帮我寄信的。那，那是一封写给南部母亲的信。我茫然站在骑楼下，我又看到永远的樱子走到街心。其实雨下得并不大，却是一生一世中最大的一场雨。而那封信是这样写的，年轻的樱子知不知道呢？</p>
                <img src="https://img1.baidu.com/it/u=3155988012,1977937542&fm=253&fmt=auto&app=138&f=JPG?w=640&h=343" alt="">
                <blockquote>
                  <p>妈：我打算在下个月和樱子结婚。</p>
                </blockquote><p>虽然是春天，好像已是秋深了。</p>
                <h2>啊是的萨达萨达萨达萨达撒的</h2>
                <p>她只是过马路去帮我寄信。这简单的行动，却要叫我终身难忘了。我缓缓睁开眼，茫然站在骑楼下，眼里裹着滚烫的泪水。世上所有的车子都停了下来，人潮涌向马路中央。没有人知道那躺在街面的，就是我的，蝴蝶。这时她只离我五公尺，竟是那么遥远。更大的雨点溅在我的眼镜上，溅到我的生命里来。</p>
                <p>为什么呢？只带一把雨伞？</p>
                <p>然而我又看到樱子穿着白色的风衣，撑着伞，静静地过马路了。她是要帮我寄信的。那，那是一封写给南部母亲的信。我茫然站在骑楼下，我又看到永远的樱子走到街心。其实雨下得并不大，却是一生一世中最大的一场雨。而那封信是这样写的，年轻的樱子知不知道呢？</p>
                <blockquote>
                  <p>妈：我打算在下个月和樱子结婚。</p>
                </blockquote>`
})
const props = ref({
  title: 'title',
  meta: 'meta',
  lead: 'lead',
  body: 'body'
})
let config = reactive({
  user: {
    id: '1',
    username: 'user',
    avatar: 'https://static.juzicon.com/avatars/avatar-200602130320-HMR2.jpeg?x-oss-process=image/resize,w_100',
    // 评论id数组 建议:存储方式用户id和文章id和评论id组成关系,根据用户id和文章id来获取对应点赞评论id,然后加入到数组中返回
    likes: [1, 2, 11]
  },
  emoji: emoji,
  comments: []
});
let temp_id = 100;
// 提交评论事件
let submit =  (content, parentId, finish)=> {
  let comment = {
    id: String((temp_id += 1)),
    parentId: parentId,
    uid: config.user.id,
    username: config.user.username,
    avatar: config.user.avatar,
    level: 6,
    link: "/" + (temp_id += 1),
    address: '来自江苏',
    content: content,
    like: 0,
    createTime: '1分钟前',
    reply: null
  };
  setTimeout(()=> {
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
  setTimeout( ()=> {
    finish();
  }, 200);
};
config.comments = [
  {
    id: '1',
    parentId: null,
    uid: '1',
    username: '落🤍尘',
    avatar: 'https://static.juzicon.com/avatars/avatar-200602130320-HMR2.jpeg?x-oss-process=image/resize,w_100',
    level: 6,
    link: '/1',
    address: '来自上海',
    content:
        '缘生缘灭，缘起缘落，我在看别人的故事，别人何尝不是在看我的故事?别人在演绎人生，我又何尝不是在这场戏里?谁的眼神沧桑了谁?我的眼神，只是沧桑了自己[喝酒]',
    like: 2,
    createTime: '1分钟前'
  },
  {
    id: '2',
    parentId: null,
    uid: '2',
    username: '悟二空',
    avatar: 'https://static.juzicon.com/user/avatar-bf22291e-ea5c-4280-850d-88bc288fcf5d-220408002256-ZBQQ.jpeg',
    level: 1,
    link: '/2',
    address: '来自苏州',
    content: '知道在学校为什么感觉这么困吗？因为学校，是梦开始的地方。[脱单doge]',
    like: 11,
    createTime: '1天前',
    reply: {
      total: 2,
      list: [
        {
          id: '21',
          parentId: '2',
          uid: '3',
          username: '别扰我清梦*ぁ',
          avatar:
              'https://static.juzicon.com/user/avatar-8b6206c1-b28f-4636-8952-d8d9edec975d-191001105631-MDTM.jpg?x-oss-process=image/resize,m_fill,w_100,h_100',
          level: 5,
          link: '/21',
          address: '来自重庆',
          content: '说的对，所以，综上所述，上课睡觉不怪我呀💤',
          like: 3,
          createTime: '1分钟前'
        },
        {
          id: '22',
          parentId: '2',
          uid: '4',
          username: 'Blizzard',
          avatar:
              'https://static.juzicon.com/user/avatar-3cb86a0c-08e7-4305-9ac6-34e0cf4937cc-180320123405-BCV6.jpg?x-oss-process=image/resize,m_fill,w_100,h_100',
          level: 3,
          link: '/22',
          content: '回复 <span style="color: blue;"">@别扰我清梦*ぁ:</span> 看完打了一个哈切。。。会传染。。。[委屈]',
          address: '来自广州',
          like: 9,
          createTime: '1天前'
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