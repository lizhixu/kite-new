<template>
  <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
      class="k-header"
      v-if="headerShow"
      active-text-color="#5cb9ff" :router="true"
  >
    <el-menu-item class="logo">
      <router-link to="/">
        <img :src="cdn_path + blogConfig?.logo.data[0].attributes.url"
             alt="logo" style="width: 50px;" v-if="blogConfig">
      </router-link>
    </el-menu-item>
    <el-menu-item index="/">首页</el-menu-item>
    <el-sub-menu index="2" popper-class="k-avatar-sub">
      <template #title>专栏</template>
      <template v-for="cate in category.categories">
        <el-menu-item :index="'/special/'+cate.id" v-if="cate.attributes.status">{{
            cate.attributes.name
          }}
        </el-menu-item>
      </template>
    </el-sub-menu>
    <!--    <el-menu-item index="3">Tool</el-menu-item>-->
    <div class="flex-grow"/>
    <el-menu-item class="k-avatar" v-if="!token" @click="dialogLoginVisible = true">
      <template #title>
        <el-icon>
          <Cellphone/>
        </el-icon>
        <span>登录</span>
      </template>
    </el-menu-item>

    <el-sub-menu v-else index="avatar" popper-class="k-avatar-sub">
      <template #title>
        <el-avatar
            :src="me?.avatar_url"></el-avatar>
      </template>
      <el-menu-item @click="signOut()">退出</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <el-dialog v-model="dialogLoginVisible" width="800px" align-center>
    <Login @close-dialog="dialogLoginVisible = false;"/>
  </el-dialog>
</template>

<script setup>
import {inject, onMounted, ref, watch} from 'vue'
import {useCategoryStore} from "@/stores/category";
import {ElNotification} from "element-plus";
import {cdn_path, deleteCache} from "@/utils/util";
import {loadComment, ssoLogout} from "@/utils/changyan";
import {useRoute} from "vue-router";
import router from "@/router";

const route = useRoute();
const token = inject('token');
const me = inject('me');
const headerShow = ref(true);
const blogConfig = inject('blogConfig');
const activeIndex = ref('')
const handleSelect = (key, keyPath) => {
  if (key === 3) {
    return
  }
}
const category = useCategoryStore();

function signOut() {
  deleteCache();
  ssoLogout();
  if (route.name === 'article_detail') {
    loadComment()
  }
  token.value = '';
  ElNotification({
    duration: 2000,
    message: '注销成功！！',
    type: 'success'
  })
}

const dialogLoginVisible = ref(false)
top.window.Login = () => dialogLoginVisible.value = true;

const lastScrollTop = ref(0);
onMounted(() => {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset < window.screen.height && headerShow.value) {
      return;
    }
    headerShow.value = lastScrollTop.value > window.pageYOffset;
    lastScrollTop.value = window.pageYOffset;
  })
})
watch(
    () => router.currentRoute.value,
    (newRoute) => {
      // 这里已拿到最新的路由地址，可将其设置给 el-menu 的 default-active 属性
      activeIndex.value = newRoute.path;
    },
    {immediate: true}
)
</script>

<style>
.flex-grow {
  flex-grow: 1;
}

.el-header {
  --el-header-padding: 0px;
}

.k-header {
  width: 1110px;
  margin: auto;
  border-bottom: none !important;
  background-color: #FFFFFF00;
}

.logo:after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 1px;
  height: 20px;
  background: #ddd;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}

.el-menu-item, .el-sub-menu__title {
  font-weight: bold;
}

.k-avatar {
  margin: auto !important;
}

.k-avatar:hover {
  background-color: #00000000 !important;
}

.k-avatar-sub {
  .el-menu--popup {
    min-width: 6.5rem !important;
    text-align: center;
  }

  .el-menu-item {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>