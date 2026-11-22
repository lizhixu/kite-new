---
id: 3
title: "Vue 3 + Vite 现代化前端工程化实践"
description: "总结在本次博客重构中，Vue 3 组合式 API 与 Vite 6 的工程化优化技巧。"
category: "前端技术"
tags: ["Vue3", "Vite", "前端开发", "JavaScript"]
chosen: false
views: 88
---

# Vue 3 + Vite 现代化前端工程化实践

在现代前端开发中，Vite 与 Vue 3 的搭配已经成为了标准生产力组合。

## 关键实践

### 1. 自动按需引入
借助 `unplugin-auto-import` 和 `unplugin-vue-components`，无需手动在每个组件中重复书写：
```javascript
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
```
在模板和逻辑代码中直接调用即可，打包时自动按需引入，有效减少产物体积。

### 2. 客户端全文搜索
为了摆脱对昂贵的在线搜索服务（如 Algolia）的依赖，我们可以在前端构建期提取文章关键信息生成 `search.json`，在客户端通过 `minisearch` 建立倒排索引，配合全局快捷键 `Cmd/Ctrl + K` 呼出，带来毫秒级的极速检索体验。

### 3. 数据层与视图解耦
将原本紧耦合于后端 Strapi 的请求层改造成统一适配器模式，通过读取本地预生成的静态 JSON，可以在保留现有界面组件全部业务逻辑的同时，无痛切换底层数据源。
