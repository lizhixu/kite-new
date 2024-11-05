<template>
  <div class="translation-container">
    <div class="top-bar">
      <el-select v-model="translationEngine" @change="handleEngineChange" size="large" class="select-box">
        <el-option
            v-for="engine in translationEngines"
            :key="engine.value"
            :value="engine.value"
            :label="engine.label"
        >
          <div class="engine-option">
            <img :src="engine.logo" :alt="engine.label" class="engine-logo"/>
            {{ engine.label }}
          </div>
        </el-option>
      </el-select>
      <div class="language-bar">
        <el-select v-model="sourceLanguage" @change="handleTranslate" size="large" class="select-box">
          <el-option v-for="lang in languages" :key="lang.value" :value="lang.value" :label="lang.label"/>
        </el-select>
        <el-button @click="swapLanguages" :icon="Refresh" circle class="swap-btn"/>
        <el-select v-model="targetLanguage" @change="handleTranslate" size="large" class="select-box">
          <template v-for="lang in languages">
            <el-option v-if="lang.value !== 'auto'" :value="lang.value" :label="lang.label"/>
          </template>
        </el-select>
      </div>
      <div class="placeholder"></div>
    </div>
    <div class="translation-content">
      <div class="input-area">
        <el-input
            v-model="inputText"
            type="textarea"
            :rows="16"
            :placeholder="'请输入要翻译的文本（最多 6000 bytes）'"
            @input="handleInputChange"
            resize="none"
            class="translation-area"
            ref="inputTextarea"
        />
        <el-button
            v-if="inputText"
            :icon="Delete"
            circle
            class="clear-btn"
            @click="clearInput"
            :title="'清空输入'"
        />
        <div class="input-info">
          <el-text class="word-count" size="small">{{ inputWordCount }} 个字</el-text>
          <el-text
              class="byte-count"
              size="small"
              :type="byteCountType"
          >
            {{ inputByteCount }} / {{ MAX_BYTE_LENGTH }} bytes
          </el-text>
        </div>
      </div>
      <div class="output-area">
        <el-input
            v-model="translatedText"
            type="textarea"
            :rows="16"
            :placeholder="'译文'"
            readonly
            resize="none"
            class="translation-area"
            ref="outputTextarea"
        />
        <el-button
            v-if="translatedText"
            :icon="CopyDocument"
            circle
            class="copy-btn"
            @click="copyTranslation"
            :title="'复制翻译结果'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {find} from "@/utils/strapi";
import {ElMessage} from 'element-plus'
import {CopyDocument, Delete, Refresh} from '@element-plus/icons-vue'
import {getAttributesImg} from "@/utils/util";
import {getItem} from "@/utils/toolkit";
import {debounce} from "lodash-es";

const translationEngines = ref([]);

const languages = ref();

const translationEngine = ref('')
const sourceLanguage = ref('')
const targetLanguage = ref('')
const inputText = ref('')
const translatedText = ref('')
const isTranslating = ref(false)

const MAX_BYTE_LENGTH = ref(6000)

const translateUri = ref();

const inputWordCount = computed(() => {
  return inputText.value.trim().length
})

const inputByteCount = computed(() => {
  return new Blob([inputText.value]).size
})

const byteCountType = computed(() => {
  if (inputByteCount.value > MAX_BYTE_LENGTH.value * 0.9) return 'danger'
  if (inputByteCount.value > MAX_BYTE_LENGTH.value * 0.7) return 'warning'
  return 'info'
})

const truncateInput = (text) => {
  let truncated = text
  while (new Blob([truncated]).size > MAX_BYTE_LENGTH.value) {
    truncated = truncated.slice(0, -1)
  }
  return truncated
}

const handleInputChange = (value) => {
  if (new Blob([value]).size > MAX_BYTE_LENGTH.value) {
    const truncatedText = truncateInput(value)
    inputText.value = truncatedText
    ElMessage.warning(`输入已超过${MAX_BYTE_LENGTH.value}字节，内容已自动截取`)
  }
  handleTranslate()
}

const handleEngineChange = () => {
  handleTranslate()
}

const handleTranslate = debounce(() => {
  if (inputText.value.trim() === '') {
    translatedText.value = ''
    return
  }

  isTranslating.value = true
  const origin_data = translateUri.value.data;
  const data = {};
  Object.keys(origin_data).forEach(index => {
    data[index] = origin_data[index].replace('{from_txt}', sourceLanguage.value).replace('{to_txt}', targetLanguage.value).replace('{query}', inputText.value)
  })
  getItem({...translateUri.value, data}).then(res => {
    translatedText.value = res.data.to_txt
    isTranslating.value = false
  })
}, 500)

const swapLanguages = () => {
  if (sourceLanguage.value !== 'auto') {
    [sourceLanguage.value, targetLanguage.value] = [targetLanguage.value, sourceLanguage.value]
    handleTranslate()
  }
}

const copyTranslation = () => {
  navigator.clipboard.writeText(translatedText.value).then(() => {
    ElMessage({
      message: '翻译结果已复制到剪贴板',
      type: 'success',
    })
  })
}

const clearInput = () => {
  inputText.value = ''
  translatedText.value = ''
}

/**
 * 获取翻译引擎
 * @returns {Promise<void>}
 */
async function getTranslationEngines() {
  const data = await find('translate-configs', {populate: '*'});
  translationEngines.value.push(...data.data.map(item => {
    const {attributes} = item;
    if (attributes.default) {
      translationEngine.value = attributes.key;
      sourceLanguage.value = attributes.source_language;
      targetLanguage.value = attributes.target_language;
      MAX_BYTE_LENGTH.value = attributes.max_byte_length;
    }
    return {
      label: attributes.name,
      logo: getAttributesImg(item, 'logo'),
      key: attributes.key,
      value: attributes.key,
      default: attributes.default,
      request_uri: attributes.request_uri,
    }
  }));
}

async function getLanguages() {
  const data = translationEngines.value.find(item => item.key === translationEngine.value);
  const request_uri = data.request_uri;
  languages.value = (await getItem(request_uri.getLanguageList)).data?.map(item => {
    return {
      label: item.title,
      value: item.sign
    }
  })
  translateUri.value = request_uri.translate;
}

onMounted(async () => {
  await getTranslationEngines();
  await getLanguages();
})
</script>

<style scoped>
.translation-container {
  width: 1110px;
  margin: 0 auto;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.language-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.select-box {
  width: 220px;
}

.placeholder {
  width: 220px; /* 与 select-box 宽度相同，用于保持对称 */
}

.swap-btn {
  font-size: 20px;
}

.translation-content {
  display: flex;
  gap: 30px;
}

.input-area, .output-area {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.translation-area {
  height: 450px !important;
}

.input-info {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.word-count, .byte-count {
  color: #909399;
}

.copy-btn, .clear-btn {
  position: absolute;
  right: 10px;
  bottom: 30px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.copy-btn:hover, .clear-btn:hover {
  opacity: 1;
}

:deep(.el-textarea__inner) {
  font-size: 16px;
  line-height: 1.5;
  height: 450px !important;
  padding: 15px;
}

:deep(.el-card__body) {
  padding: 20px 30px 30px;
}

/* 添加动画效果 */
.clear-btn, .copy-btn {
  transition: all 0.3s ease;
}

.clear-btn:hover, .copy-btn:hover {
  transform: scale(1.1);
}

/* 自定义下拉框样式 */
:deep(.el-select) {
  width: 220px;
}

:deep(.el-select .el-input__inner) {
  text-align: center;
  padding-left: 30px; /* 为选中后的图标留出空间 */
}

:deep(.el-select-dropdown__item) {
  text-align: center;
}

:deep(.el-select-dropdown__wrap) {
  max-height: 280px;
  overflow-y: auto;
}

/* 自定义滚动条样式 */
:deep(.el-textarea__inner)::-webkit-scrollbar {
  width: 8px;
}

:deep(.el-textarea__inner)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.el-textarea__inner)::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

:deep(.el-textarea__inner)::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox */
:deep(.el-textarea__inner) {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

/* 下拉框滚动条样式 */
:deep(.el-select-dropdown__wrap)::-webkit-scrollbar {
  width: 6px;
}

:deep(.el-select-dropdown__wrap)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.el-select-dropdown__wrap)::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

:deep(.el-select-dropdown__wrap)::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox */
:deep(.el-select-dropdown__wrap) {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

/* 翻译引擎选项样式 */
.engine-option {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.engine-logo {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  object-fit: contain;
}

.selected-engine-logo {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}
</style>