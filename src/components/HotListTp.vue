<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">热门文章</span>
      </div>
    </template>
    <div class="hot-list">
      <el-row :gutter="10" v-for="o in 6" :class="o>1?'mgt10':''">
        <el-col :span="8">
          <span class="hot-list-num" :class="o<4?('hot-list-num'+o):''">{{ o }}</span>
          <el-link :underline="false">
            <el-image style="border-radius: 5px"
                      src="//p8.itc.cn/q_70/images03/20210729/b17c17d08e4f4791b3abf393b2f7692d.png"/>
          </el-link>
        </el-col>
        <el-col :span="16">
          <el-link :underline="false">
            十个免费短视频和音乐素材网站-可免费商用4K高清视频和音频资源
          </el-link>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup>
</script>

<style scoped>
.hot-list-num {
  position: absolute;
  left: 5px;
  background: #999;
  font-size: 12px;
  color: #fff;
  line-height: 180%;
  margin: 0 8px 0 0;
  padding: 0 5px 1px;
  border-radius: 2px;
  z-index: 1;
}

.hot-list-num1 {
  background: #C00;
}

.hot-list-num2 {
  background: #ef8f31;
}

.hot-list-num3 {
  background: #6bd139;
}
</style>