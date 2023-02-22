<template>
  <div v-for="o in 10" :key="o">
    <el-card class="box-card mgt10">
      <el-row :gutter="30">
        <el-col :span="7">
          <router-link :to="'/article_detail/'+o">
            <el-image style="width: 205px; height: 150px;border-radius: 5px"
                      src="https://picx.zhimg.com/v2-c723c96636425aec5c56429abfb30d49_1440w.jpeg?source=d16d100b"/>
          </router-link>
        </el-col>
        <el-col :span="17">
          <div class="start-cover" :style="{'background-image':'url(//ttfou.com/images/2022/10/14/4d87388bf56266cd39af0ea1170ab64c.png)'}"></div>
          <router-link :to="'/article_detail/'+o" class="article-title">
            通过SourceMap还原了Vue前端代码怎么去运行调试和二次开发？
          </router-link>
          <u-fold line="2" class="article-desc">
            <p>
              每当白日依山尽，夕阳余辉便透过朵朵云层，像万道金光，如霞光万丈，把天空白云染得红彤彤，把大地山河映得金灿灿，仿佛整个世界在那一瞬间都变得金碧辉煌，热情奔放起来</p>
          </u-fold>
          <el-row :gutter="10" class="article-detail">
            <el-col :span="6">
              <span><Clock style="width: 1em;"/>2022-09-08</span>
            </el-col>
            <el-col :span="5">
              <span><View style="width: 1em;"/>100阅读</span>
            </el-col>
            <el-col :span="5">
              <router-link :to="'/article_detail/'+o +'#comment'" class="article-detail-a">
                <ChatRound style="width: 1em;"/>
                <span>100评论</span>
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
    <el-card class="box-card mgt10">
      <div class="start-cover start-cover-2" :style="{'background-image':'url(//ttfou.com/images/2022/10/14/f76944211232b03289ab30dcb8e841c0.png)'}"></div>
      <router-link :to="'/article_detail/'+o" class="article-title" style="width: 550px">
        通过SourceMap还原了Vue前端代码怎么去运行调试和二次开发？
      </router-link>
      <u-fold line="2" class="article-desc">
        <p>
          每当白日依山尽，夕阳余辉便透过朵朵云层，像万道金光，如霞光万丈，把天空白云染得红彤彤，把大地山河映得金灿灿，仿佛整个世界在那一瞬间都变得金碧辉煌，热情奔放起来</p>
      </u-fold>
      <el-row :gutter="10" class="article-detail">
        <el-col :span="6">
          <span><Clock style="width: 1em;"/>2022-09-08</span>
        </el-col>
        <el-col :span="5">
          <span><View style="width: 1em;"/>100阅读</span>
        </el-col>
        <el-col :span="5">
          <router-link :to="'/article_detail/'+o +'#comment'" class="article-detail-a">
            <ChatRound style="width: 1em;"/>
            <span>100评论</span>
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
  </div>
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

.article-desc {
  font-size: 14px;
  margin-top: -10px;
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