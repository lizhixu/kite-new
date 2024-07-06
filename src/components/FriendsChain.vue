<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">友链</span>
        <el-button text>
          <IconApply/>
        </el-button>
      </div>
    </template>
    <div class="f-link">
      <template v-for="friend in friends" :key="friend?.id">
        <el-link :href="getAttributes(friend, 'site_url')" target="_blank">
          {{ getAttributes(friend, 'title') }}
        </el-link>
      </template>
    </div>
  </el-card>
</template>

<script setup>
import {find} from "@/utils/strapi";
import {ref} from "vue";
import {getAttributes} from "@/utils/util";

const friends = ref([]);
find('friends-chains', {
  populate: '*',
  filters: {},
  sort: 'sort:desc',
  pagination: {start: 0, limit: 10}
}).then((res) => {
  friends.value = res.data;
});
</script>

<style scoped>

.f-link > a {
  margin-right: 8px;
  text-decoration: none;
  background: transparent;
}
</style>