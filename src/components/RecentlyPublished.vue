<template>
  <el-card v-if="related">
    <template #header>
      <div class="card-header">
        <span class="c-s-title">相关推荐</span>
      </div>
    </template>
    <el-timeline>
      <el-timeline-item
          v-for="(item, index) in related"
          :key="index"
          :type="'primary'"
          :hollow="true"
          :timestamp="dayjs(getAttributes(item, 'articleUpdatedAt')).format('YYYY-MM-DD HH:mm')"
      >
        <a :href="`/article_detail/${item?.id}`" :title="getAttributes(item, 'title')"
           target="_blank">{{ getAttributes(item, 'title') }}</a>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {find} from "@/utils/strapi";
import {getAttributes} from "@/utils/util";
import dayjs from "dayjs";
import {isEmpty} from "lodash-es";

const props = defineProps(['tags', 'id']);
//相关推荐
const related = ref();
watch(props, () => {
  const tags = props.tags?.map?.((item) => {
    return item.id;
  })

  if (!isEmpty(tags)){
    find('articles', {
      'filters[tags][$in]': tags,
      'filters[id][$ne]': props.id,
      'sort[0]': 'articleUpdatedAt:desc',
      'populate': '*',
      'pagination[page]': 1,
      'pagination[pageSize]': 10
    }).then((res) => {
      if (res.data.length > 0) {
        related.value = res.data;
      }
    })
  }
})
</script>
