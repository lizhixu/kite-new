<template>
  <el-row class="main-content">
    <el-col :span="4" class="content">
      <el-affix :offset="120">
        <el-scrollbar :noresize="true" height="400px" class="special">
          <ul>
            <li v-for="item in categorys" class="special-label"
                :class="item.id == special_id ? 'special-label-activate' : ''">
              <div @click="renderArticle(item.id)" style="cursor:pointer">
                <i class="iconfont icon-hashjinghao special-label-i"
                   :class="item.id == special_id ? 'special-label-activate-i' : ''"></i>
                {{ getAttributes(item, 'name') }}
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </el-affix>
    </el-col>
    <el-col :span="14" class="content">
      <CategoryArticle :id="special_id" :cur_page="cur_page"/>
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
import CategoryArticle from "@/components/CategoryArticle.vue";
import CategoryLabel from "@/components/CategoryLabel.vue";
import HotListTp from "@/components/HotListTp.vue";
import {useCategoryStore} from "@/stores/category";
import StickySidebar from "sticky-sidebar-v2";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {fremoveHtmlStyle, getAttributes} from "../utils/util";
import _, {findKey} from "lodash-es";
import {useHead} from "@/hooks/useHead";

const route = useRoute();
const params = route.params;
const special_id = ref(params.id);
const cur_page = ref(params.page);
const categorys = useCategoryStore().categories;
let curSpecial = categorys[findKey(categorys, item => item.id == special_id.value)];

function renderArticle(id) {
  special_id.value = id;
  curSpecial = categorys[findKey(categorys, item => item.id == special_id.value)];
  updateHead();
  history.pushState({}, '', `/special/${id}`);
  document.documentElement.scrollTop = 0;
}

onMounted(() => {
  var sidebar = new StickySidebar('.sidebar', {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '.main-content',
    scrollContainer: '#main-viewport'
  });
  updateHead();
})

function updateHead() {
  const name = getAttributes(curSpecial, 'name');
  const describe = getAttributes(curSpecial, 'describe');
  useHead({
    title: name + route.meta.title,
    meta: [
      {name: 'description', content: describe},
      {name: 'keywords', content: name}
    ],
  })
}
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