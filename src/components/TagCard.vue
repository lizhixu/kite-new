<template>
  <el-card class="tag-card" :body-style="{ padding: '0px' }">
    <el-row>
      <el-col :span="20">
        <div class="card-content">
          <h3 class="title">{{ tag.title }}</h3>
          <p v-if="tag.description" class="description">
            {{ tag.description }}
            <el-link
                v-if="tag.detailLink"
                :href="tag.detailLink"
                type="primary"
                class="detail-link"
            >
              [详情]
            </el-link>
          </p>
          <el-tag type="info">{{ tag.articleCount }} 篇文章</el-tag>
        </div>
      </el-col>
      <el-col :span="4">
        <div v-if="tag.image" class="image-container">
          <el-image :src="tag.image" fit="cover"/>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import {defineProps} from 'vue'

const props = defineProps({
  tag: {
    type: Object,
    required: true,
    validator: (tag) => {
      return tag.title && typeof tag.articleCount === 'number'
    }
  }
})
</script>

<style scoped>
.tag-card {
  transition: all 0.3s;
}

.tag-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

.image-container {
  //height: 200px;
  overflow: hidden;
}

.card-content {
  padding: 16px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 16px;
  line-height: normal;
}

.detail-link {
  margin-left: 8px;
}
</style>