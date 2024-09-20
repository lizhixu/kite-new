<script setup>
import CategoryLabel from "@/components/CategoryLabel.vue";
import {Watermark} from '@watermarkify/vue-watermark'
import {ref} from "vue";
import {useRoute} from "vue-router";
import {getBaikeItem} from "@/utils/toolkit"

const route = useRoute();
const query = route.query;
const watermarkOptions = ref({
  content: query.name,
  gap: [20, 20],
  offset: [10, 10],
  zIndex: 5,
  rotate: -20,
})
getBaikeItem(query.name)
</script>

<template>
  <el-row class="main-content">
    <el-col :span="17" class="content">
      <Watermark :options="watermarkOptions">
        <el-card>
          <h2>{{ query.name}}</h2>
          <span style="color: #495057">100篇文章</span>
        </el-card>
      </Watermark>
    </el-col>
    <el-col :span="7" class="sidebar">
      <div class="sidebar__inner">
        <CategoryLabel/>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>