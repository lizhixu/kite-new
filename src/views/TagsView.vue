<script setup>
import CategoryLabel from "@/components/CategoryLabel.vue";
import {ref} from "vue";
import {useRoute} from "vue-router";
import {getBaikeItem} from "@/utils/toolkit"
import TagCard from "@/components/TagCard.vue";

const route = useRoute();
const query = route.query;
const tags = ref([])
getBaikeItem(query.name).then(res => {
  const data = res.data;
  console.log(data)
  tags.value.push({
    id: data.id,
    title: query.name,
    description: data.abstract,
    detailLink: data.url,
    articleCount: 42,
    image: data.image
  })
})
</script>

<template>
  <el-row class="main-content">
    <el-col :span="17" class="content">
      <TagCard
          v-for="tag in tags"
          :key="tag.id"
          :tag="tag"
      />
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