<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">标签</span>
      </div>
    </template>
    <div class="category">
      <el-button round v-for="(tag,index) in tags" :key="index" @click="jumpTag(tag)">
        {{ getAttributes(tag, 'name') }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import {getAttributes} from "@/utils/util";

const props = defineProps(['tags']);

function jumpTag(tag) {
  window.open(`${window.location.origin}/tags?name=${getAttributes(tag, 'name')}&id=${tag.id}`, '_blank')
}
</script>

<style scoped>
.category > button {
  margin: 5px;
}
</style>