<template>
  <el-card class="copyright">
    <p><i class="iconfont icon-dc-icon-beiangaoqishuliang" style="color: #0649d0"></i> 陇ICP123213-1</p>
    <p><i class="iconfont icon-banquan" style="color: #ff2d2d"></i> 2010-{{year}} 爱的飞行日记</p>
    <span>
      <IconSupport/>
      Designed By <el-link type="danger">lizhixu</el-link>
    </span>
    <p>
      <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/cn/deed.zh" target="_blank"><i
          class="iconfont icon-cc"></i> CC BY-NC-SA 3.0 CN</a>
    </p>
  </el-card>
</template>

<script setup>
let year = ref();
let date = new Date();
year = date.getFullYear()
</script>

<style scoped>
.copyright {
  text-align: center;
  color: #8590a6;
}
</style>