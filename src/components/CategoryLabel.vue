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
find('tags', {
  populate: '*', random: true,
  pagination: {start: 0, limit: 14}
}).then((res) => {
  tags.value = res.data;
})
</script>

<style scoped>
.category-label-tag {
  margin: 0.25rem;
}
</style>