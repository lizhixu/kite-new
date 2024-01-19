<template>
  <el-card>
    <el-row :gutter="10">
      <el-col :span="7">
        <img :src="config?.ad.img" :alt="config?.ad.h4" class="wx-code-img" v-if="config?.ad"/>
      </el-col>
      <el-col :span="17" class="wx-code-msg">
        <h4>{{ config?.ad.h4 }}</h4>
        <p>{{ config?.ad.p }}</p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
const config = inject('blogConfig');
</script>

<style scoped>
.wx-code-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wx-code-msg {
  line-height: 2px;
  margin: auto;
}

.wx-code-msg > p {
  font-size: 14px;
}
</style>