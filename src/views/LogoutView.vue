<script setup>
import "@lottiefiles/lottie-player";
import {useRoute} from "vue-router";
import {deleteCache} from "@/utils/util";
import {loadComment} from "@/utils/changyan";
import {inject, onMounted, ref} from "vue";
import router from "@/router";

const route = useRoute();
const query = route.query;
const token = inject('token');

const logout = () => {
  deleteCache();
  console.log('logout')
  if (route.name === 'article_detail') {
    loadComment()
  }
  token.value = '';
}

const speed = ref(3);
onMounted(() => {
  logout();
  top.window[query.callback] && top.window[query.callback]({code: 1, reload_page: 0});
  const timer = setInterval(() => {
    if (speed.value === 0) {
      clearInterval(timer);
      router.push('/');
    }
    speed.value--;
  }, 1000)
});
</script>

<template>
  <main>
    <lottie-player
        autoplay
        loop
        mode="normal"
        src="/animation-logout.json"
        style="width: 350px;margin: auto;"
    >
    </lottie-player>
    <h2 class="tips-logout mgb10">退出成功！</h2>
    <div class="tips-logout">页面将在 {{ speed }} 秒后自动跳转！</div>
    <el-row style="text-align: center">
      <el-col :span="12"></el-col>
      <el-col :span="12"></el-col>
    </el-row>
  </main>
</template>

<style scoped>
.tips-logout {
  text-align: center;
  color: #73767a;
}
</style>