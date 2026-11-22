<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    width="680px"
    class="search-dialog"
    append-to-body
    @opened="onOpened"
  >
    <div class="search-modal-container">
      <div class="search-input-wrapper">
        <el-icon class="search-icon"><Search /></el-icon>
        <input
          ref="inputRef"
          v-model="keyword"
          class="search-input"
          placeholder="搜索文章标题、内容、分类或标签... (支持快捷键 ⌘K / Ctrl+K)"
          @input="onSearch"
          @keydown.down.prevent="moveHighlight(1)"
          @keydown.up.prevent="moveHighlight(-1)"
          @keydown.enter.prevent="selectCurrent"
          @keydown.esc="visible = false"
        />
        <span class="esc-badge" @click="visible = false">ESC</span>
      </div>

      <div class="search-results-wrapper" v-loading="loading">
        <div v-if="results.length > 0" class="search-results-list">
          <div
            v-for="(item, index) in results"
            :key="item.id"
            :class="['search-result-item', { active: activeIndex === index }]"
            @mouseenter="activeIndex = index"
            @click="goToArticle(item.id)"
          >
            <div class="result-header">
              <span class="result-title" v-html="highlight(item.title)"></span>
              <span v-if="item.category" class="result-category">{{ item.category }}</span>
            </div>
            <p class="result-snippet" v-html="highlight(item.snippet)"></p>
            <div v-if="item.tags && item.tags.length" class="result-tags">
              <span v-for="tag in item.tags" :key="tag" class="result-tag">#{{ tag }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="keyword.trim()" class="search-empty">
          <el-empty :image-size="80" description="未找到相关文章，换个关键词试试吧" />
        </div>

        <div v-else class="search-hints">
          <div class="hint-title">快捷检索技巧</div>
          <div class="hint-items">
            <span class="hint-chip">输入文章标题关键词</span>
            <span class="hint-chip">输入分类名或标签（如 Vue3、ESA）</span>
            <span class="hint-chip">上下箭头 ↑ ↓ 切换选中，回车直达</span>
          </div>
        </div>
      </div>

      <div class="search-footer">
        <span><kbd>↑</kbd> <kbd>↓</kbd> 切换</span>
        <span><kbd>↵</kbd> 打开</span>
        <span><kbd>esc</kbd> 关闭</span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import MiniSearch from 'minisearch';
import { getSiteData } from '@/utils/strapi';

const router = useRouter();
const visible = ref(false);
const keyword = ref('');
const results = ref([]);
const activeIndex = ref(0);
const loading = ref(false);
const inputRef = ref(null);

let miniSearchInstance = null;
let rawDocuments = [];

async function loadSearchData() {
  if (miniSearchInstance) return;
  loading.value = true;
  try {
    const siteData = await getSiteData();
    rawDocuments = siteData.search || [];
    miniSearchInstance = new MiniSearch({
      fields: ['title', 'description', 'category', 'tags', 'summary'],
      storeFields: ['id', 'title', 'description', 'category', 'tags', 'summary'],
      searchOptions: {
        boost: { title: 3, tags: 2, description: 1.5 },
        fuzzy: 0.2,
        prefix: true,
      },
    });
    miniSearchInstance.addAll(rawDocuments);
  } catch (err) {
    console.error('Failed to load search index:', err);
  } finally {
    loading.value = false;
  }
}

function open() {
  visible.value = true;
  loadSearchData();
}

function close() {
  visible.value = false;
}

function onOpened() {
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function onSearch() {
  activeIndex.value = 0;
  const q = keyword.value.trim();
  if (!q) {
    results.value = [];
    return;
  }

  if (!miniSearchInstance) {
    results.value = [];
    return;
  }

  const matched = miniSearchInstance.search(q);
  results.value = matched.slice(0, 10).map((item) => {
    const snippetSource = item.description || item.summary || '';
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      tags: Array.isArray(item.tags) ? item.tags : [],
      snippet: snippetSource.slice(0, 120),
    };
  });
}

function moveHighlight(step) {
  if (results.value.length === 0) return;
  const newIndex = activeIndex.value + step;
  if (newIndex < 0) {
    activeIndex.value = results.value.length - 1;
  } else if (newIndex >= results.value.length) {
    activeIndex.value = 0;
  } else {
    activeIndex.value = newIndex;
  }
}

function selectCurrent() {
  if (results.value.length > 0 && results.value[activeIndex.value]) {
    goToArticle(results.value[activeIndex.value].id);
  }
}

function goToArticle(id) {
  visible.value = false;
  router.push(`/article_detail/${id}`);
}

function highlight(text) {
  if (!text) return '';
  const q = keyword.value.trim();
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="highlight-text">$1</mark>');
}

function handleKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    if (visible.value) {
      close();
    } else {
      open();
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

defineExpose({
  open,
  close,
});
</script>

<style scoped>
:deep(.search-dialog) {
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

:deep(.search-dialog .el-dialog__header) {
  display: none;
}

:deep(.search-dialog .el-dialog__body) {
  padding: 0;
}

.search-modal-container {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.search-icon {
  font-size: 20px;
  color: #909399;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #303133;
  outline: none;
}

.search-input::placeholder {
  color: #a8abb2;
  font-size: 14px;
}

.esc-badge {
  font-size: 12px;
  color: #909399;
  background: #f0f2f5;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 2px 6px;
  cursor: pointer;
  user-select: none;
}

.esc-badge:hover {
  background: #e4e7ed;
}

.search-results-wrapper {
  min-height: 220px;
  max-height: 420px;
  overflow-y: auto;
  padding: 12px;
}

.search-results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-result-item {
  padding: 12px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.search-result-item.active,
.search-result-item:hover {
  background: #ecf5ff;
  border-color: #d9ecff;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.result-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.result-category {
  font-size: 12px;
  color: #409eff;
  background: #e6f1fc;
  padding: 2px 8px;
  border-radius: 4px;
}

.result-snippet {
  font-size: 13px;
  color: #606266;
  margin: 0 0 6px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-tags {
  display: flex;
  gap: 6px;
}

.result-tag {
  font-size: 12px;
  color: #909399;
}

:deep(.highlight-text) {
  background: #ffe58f;
  color: #d46b08;
  padding: 1px 3px;
  border-radius: 2px;
}

.search-empty {
  padding: 40px 0;
}

.search-hints {
  padding: 30px 20px;
  text-align: center;
}

.hint-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.hint-items {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hint-chip {
  font-size: 12px;
  color: #606266;
  background: #f4f4f5;
  padding: 4px 10px;
  border-radius: 12px;
}

.search-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 10px 20px;
  border-top: 1px solid #ebeef5;
  font-size: 12px;
  color: #909399;
  background: #fafafa;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.search-footer kbd {
  background: #f0f2f5;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  padding: 1px 4px;
  font-size: 11px;
}
</style>
