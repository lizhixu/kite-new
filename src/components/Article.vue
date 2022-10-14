<template>
  <el-card class="box-card mgt10" v-for="o in 30" :key="o">
    <div class="text item">{{ 'List item ' + o }}</div>
  </el-card>
  <div class="mgt10 mgb10 article-page">
    <el-pagination background layout="prev, pager, next" :total="1000" style="align-self: center;"/>
  </div>
</template>

<style scoped>
.article-page {
  display: flex;
  flex-direction: column;
}
</style>