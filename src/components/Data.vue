<template>
  <el-card class="box-card">
    <avue-data-display :option="option"></avue-data-display>
  </el-card>
</template>

<script setup>
import {ref} from 'vue'

const option = ref({
  span: 12,
  data: [
    {
      click: function (item) {
      },
      count: 100,
      title: '昨日被阅读数',
      href: 'javascript:;',
    },
    {
      click: function (item) {
      },
      count: 3000,
      title: '网站文章数',
      href: 'javascript:;',
    },
  ]
})
</script>

<style scoped>

</style>