<template>
  <el-card class="copyright">
    <p><i class="iconfont icon-banquan" style="color: #ff2d2d"></i> 2010-{{ year }} {{ config?.title }}</p>
    <p>
      <IconICP/>
      <a href="https://beian.miit.gov.cn/" target="_blank" style="margin-left: 10px; "> {{ config?.beian }}</a>
    </p>
    <span>
      <IconSupport/>
      Designed By <el-link type="danger">lizhixu</el-link>
    </span>
    <p>
      <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/cn/deed.zh" target="_blank"><i
          class="iconfont icon-cc"></i> CC BY-NC-SA 3.0 CN</a>
    </p>
    <div v-html="config?.copyright"></div>
  </el-card>
</template>

<script setup>
import IconICP from "@/components/icons/IconICP.vue";

let year = ref();
let date = new Date();
year = date.getFullYear()

const config = inject('blogConfig');
</script>

<style scoped>
.copyright {
  text-align: center;
  color: #8590a6;
}
</style>