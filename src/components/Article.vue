<template>
  <el-card class="box-card mgt10" v-for="o in 30" :key="o">
    <el-row :gutter="30">
      <el-col :span="7">
        <el-link :underline="false">
          <el-image style="width: 220px; height: 150px;border-radius: 5px"
                    src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.vjshi.com%2F2018-12-20%2F3f659dc9ea05a2e20f002d855d07d6a8%2F00003.jpg%3Fx-oss-process%3Dstyle%2Fwatermark&refer=http%3A%2F%2Fpic.vjshi.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668330245&t=e36bb4f8498c0db0d427e13a0a7933da"/>
        </el-link>
      </el-col>
      <el-col :span="17">
        <div class="start-cover"></div>
        <el-link :underline="false" class="article-title">城市id应该如何存储？</el-link>
        <p class="article-desc">
          原彩显示建议开吗可能是相关行业人士都值得关注的知识，在此大海号对原彩显示建议开吗知乎进行详细的介绍，并拓展一些相关的知识分享给大家，希望能够为您带来帮助！本文目录一览：1、iphone原彩显示有用吗...</p>
        <el-row :gutter="10" class="article-detail">
          <el-col :span="6">
            <span><Clock style="width: 1em;"/>2022-09-08</span>
          </el-col>
          <el-col :span="5">
            <span><View style="width: 1em;"/>100 阅读</span>
          </el-col>
          <el-col :span="5">
            <el-link :underline="false">
              <ChatRound style="width: 1em;"/>
              100 评论
            </el-link>
          </el-col>
          <el-col :span="8" class="article-author">
            <el-avatar style="width: 25px;height: 25px;margin-right: 3px;"
                       src="//tvax4.sinaimg.cn/crop.0.0.996.996.1024/e318a1b0ly8ggeuuuuuofj20ro0rotbk.jpg"
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
</script>
<style scoped>
.article-page {
  display: flex;
  flex-direction: column;
}

.article-title {
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  line-height: 26px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.article-title :hover {
  color: #0089ff;
}

.article-desc {
  font-size: 14px;
}

.start-cover {
  height: 50px;
  margin: -15px 0 -35px 0;
  /*background-image: url(//ttfou.com/images/2022/10/14/f76944211232b03289ab30dcb8e841c0.png);*/
  background-image: url(//ttfou.com/images/2022/10/14/4d87388bf56266cd39af0ea1170ab64c.png);
  background-size: 100% auto;
  background-repeat: no-repeat;
}

.article-detail {
  color: #666;
  margin-top: 20px;
}

.article-author {
  text-align: right;
}
.article-author>a {
  margin-top: -15px;
}
</style>