<script setup>
const props = defineProps(['tags', 'level'])
</script>

<template>
  <el-anchor-link v-for="(tag, index) in props.tags" :href="`#${tag['id']}`" :style="{marginLeft:`${props.level*20}px`}">
    {{ tag['text'] }}
    <Anchor v-if="tag['children']" :tags="tag['children']"
            :level="1"/>
  </el-anchor-link>
</template>

<style>
.el-anchor__link{
  color: #333333;
  font-size: 15px;
}
</style>