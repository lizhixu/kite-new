<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">精选导读</span>
      </div>
    </template>

    <el-row>
      <el-col :span="8" v-for="o in 6" class="feat-list"
              :class="(o>3?'brsd pgt10':'brsd bbsd') + (o%3 == 0?' brsdh':'')">
        <article class="guide-inner top-num0">
          <div class="guide-inner-info">
            <div class="g-i-top">
              <span class="g-i-cate">
                  <el-tag>PHP</el-tag>
              </span>
              <span class="g-i-time"><Clock style="width: 1em;"/>2022-09-08</span>
            </div>
            <h5>
              <router-link :to="'/article_detail/'+o" class="normal">iphone验机步骤（iPhone验机流程）</router-link>
            </h5>
            <p>
              最近有很多小伙伴咨询关于iphone验机步骤的问题，小编结合多年的经验整理出来一些i最近有很多小伙伴咨询关于iphone验机步骤的问题，小编结合多年的经验整理出来一些i最近有很多小伙伴咨询关于iphone验机步骤的问题，小编结合多年的经验整理出来一些i...</p>
          </div>
        </article>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
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
  overflow: hidden;
}

.normal {
  color: black;
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