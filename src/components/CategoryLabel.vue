<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">标签云</span>
      </div>
    </template>
    <div class="category-label">
      <el-tag class="category-label-tag" type="success" v-for="tag in tags" :key="tag.id">
        <router-link :to="`/tags?name=${getAttributes(tag, 'name')}&id=${tag.id}`" style="color: #00965e">
          {{ getAttributes(tag, 'name') }}
        </router-link>
      </el-tag>
    </div>
  </el-card>
</template>

<script setup>
import {find} from "@/utils/strapi";
import {getAttributes} from "../utils/util";
import {ref} from "vue";

const tags = ref();
const total = ref(0)
const randomNumbers = ref([]);
find('tags', {
  pagination: {start: 0, limit: 1}
}).then((res) => {
  total.value = res.meta.pagination.total;
  generateRandomNumbers();

  find('tags', {
    populate: '*',
    filters: {'id': {'$in': randomNumbers.value}}
  }).then((res) => {
    tags.value = res.data;
  })
})

const generateRandomNumbers = () => {
  randomNumbers.value = [];

  // 生成一个包含所有可能值的数组
  const possibleValues = Array.from({length: total.value}, (_, i) => i + 1);

  // 打乱这个数组
  shuffleArray(possibleValues);

  // 取前10个值
  for (let i = 0; i < 10; i++) {
    randomNumbers.value.push(possibleValues[i]);
  }
};

// Fisher-Yates 洗牌算法
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
</script>

<style scoped>
.category-label-tag {
  margin: 0.25rem;
}
</style>