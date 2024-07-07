<template>
  <el-row class="main-content">
    <el-col :span="4" class="content">
      <el-affix :offset="120">
        <el-scrollbar :noresize="true" height="400px" class="special">
          <ul>
            <li v-for="item in categorys" class="special-label"
                :class="item.id == special_id?'special-label-activate':''">
              <div @click="renderArticle(item.id)" style="cursor:pointer">
                <i class="iconfont icon-hashjinghao special-label-i"
                   :class="item.id == special_id?'special-label-activate-i':''"></i>
                {{ getAttributes(item, 'name') }}
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </el-affix>
    </el-col>
    <el-col :span="14" class="content">
      <CategoryArticle :id="special_id"/>
    </el-col>
    <el-col :span="6" class="sidebar">
      <div class="sidebar__inner">
        <CategoryLabel/>
        <HotListTp class="mgt10"/>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import HotListTp from "@/components/HotListTp.vue";
import CategoryLabel from "@/components/CategoryLabel.vue";
import StickySidebar from "sticky-sidebar-v2";
import CategoryArticle from "@/components/CategoryArticle.vue";
import {useCategoryStore} from "@/stores/category";
import {extractImagesFromMarkdown, getAttributes} from "../utils/util";
import {useRoute} from "vue-router";
import {ref} from "vue";
import {find} from "@/utils/strapi";
import _ from "lodash-es";

const params = useRoute().params;
let special_id = ref(params.special_name);
const categorys = useCategoryStore().categories;

function renderArticle(id) {
  special_id.value = id;
  history.pushState({}, '', `/special/${id}`);
}

onMounted(() => {
  var sidebar = new StickySidebar('.sidebar', {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '.main-content',
    scrollContainer: '#main-viewport'
  });
})
</script>

<style scoped>
.special {
}

.special-label {
  padding: 10px;
}

.special-label-i {
  color: #00965e;
}

.special-label-activate {
  color: #fff;
  background-color: #00965e;
  border: 0;
  border-radius: 0.25rem;
}

.special-label-activate > a {
  color: #fff;
}

.special-label-activate-i {
  color: #fff;
}

.special-label:hover {
  background-color: #e2e6ea !important;
}

.special-label-activate:hover {
  background-color: #00965e !important;
  border-radius: 0.25rem;
}
</style>