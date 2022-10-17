<template>
  <el-row class="main-content">
    <el-col :span="4" class="content">
      <el-affix :offset="120">
        <el-scrollbar :noresize="true" height="400px" class="special">
          <ul>
            <li v-for="item in 20" class="special-label" :class="item == 1?'special-label-activate':''">
              <router-link :to="'/special/'+item">
                <i class="iconfont icon-hashjinghao special-label-i"
                   :class="item == 1?'special-label-activate-i':''"></i> PHP-{{ item }}
              </router-link>
            </li>
          </ul>
        </el-scrollbar>
      </el-affix>
    </el-col>
    <el-col :span="13" class="content">
      <Article/>
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
}
</style>