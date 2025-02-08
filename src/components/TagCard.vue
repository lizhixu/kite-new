<template>
  <el-card class="tag-card" :body-style="{ padding: '0px' }">
    <el-skeleton :loading="!tag.title" animated :rows="3">
      <template #template>
        <el-row>
          <el-col :span="20">
            <div class="card-content">
              <el-skeleton :rows="3"/>
              <el-skeleton-item variant="text" style="margin-top:10px;width: 20%"/>
            </div>
          </el-col>
          <el-col :span="4" class="image-col">
            <el-skeleton-item variant="image" style="width: 100px; height: 100px"/>
          </el-col>
        </el-row>
      </template>
      <template #default>
        <el-row>
          <el-col :span="tag.image? 20 : 24">
            <div class="card-content">
              <h3 class="title">{{ tag.title }}</h3>
              <p v-if="tag.description" class="description">
                {{ tag.description }}
                <el-link
                    v-if="tag.detailLink"
                    :href="tag.detailLink"
                    target="_blank"
                    type="primary"
                    class="detail-link"
                >
                  [百科详情]
                </el-link>
              </p>
            </div>
          </el-col>
          <el-col v-if="tag.image" :span="4" class="image-col">
            <div class="image-container">
              <el-image :src="tag.image" class="img" fit="cover"/>
            </div>
          </el-col>
        </el-row>
      </template>
    </el-skeleton>
  </el-card>
</template>

<script setup>
import {defineProps} from 'vue'

const props = defineProps({
  tag: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>

.image-container {
  /* height: 200px; */
  overflow: hidden;
}

.card-content {
  padding: 10px 16px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 5px;
}

.description {
  font-size: 14px;
  margin-bottom: 16px;
  line-height: normal;
  text-align: justify;
}

.detail-link {
  margin-left: 8px;
}

.image-col {
  margin: auto;
  padding: 16px;
}
</style>