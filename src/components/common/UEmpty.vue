<template>
  <el-empty :image="props.url || url" :description="props.description || url"/>
</template>

<script setup>
import {useConfigStore} from "@/stores/config";
import {getAttributes} from "@/utils/util";

const props = defineProps(['url', 'description'])
const cdn_domain = import.meta.env.VITE_CDN_DOMAIN;
const config = useConfigStore().config;
const url = cdn_domain + getAttributes(config.empty.data, 'url');
</script>