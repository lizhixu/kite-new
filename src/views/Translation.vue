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
          <el-option value="auto" label="自动检测"/>
          <el-option v-for="lang in languages" :key="lang.value" :value="lang.value" :label="lang.label"/>
        </el-select>
        <el-button @click="swapLanguages" :icon="Refresh" circle class="swap-btn"/>
        <el-select v-model="targetLanguage" @change="handleTranslate" size="large" class="select-box">
          <el-option v-for="lang in languages" :key="lang.value" :value="lang.value" :label="lang.label"/>
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
            {{ inputByteCount }} / 6000 bytes
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
import {ref, computed} from 'vue'
import {ElMessage} from 'element-plus'
import {Refresh, CopyDocument, Delete} from '@element-plus/icons-vue'

const translationEngines = [
  {value: 'google', label: 'Google翻译', logo: 'https://www.google.com/favicon.ico'},
  {value: 'baidu', label: '百度翻译', logo: 'https://www.baidu.com/favicon.ico'},
  {value: 'youdao', label: '有道翻译', logo: 'https://shared.ydstatic.com/images/favicon.ico'},
]

const languages = [
  {value: 'zh', label: '中文'},
  {value: 'en', label: '英语'},
  {value: 'es', label: '西班牙语'},
  {value: 'fr', label: '法语'},
  {value: 'de', label: '德语'},
  {value: 'ja', label: '日语'},
]

const translationEngine = ref('google')
const sourceLanguage = ref('auto')
const targetLanguage = ref('en')
const inputText = ref('')
const translatedText = ref('')
const isTranslating = ref(false)

const MAX_BYTE_LENGTH = 6000

const inputWordCount = computed(() => {
  return inputText.value.trim().length
})

const inputByteCount = computed(() => {
  return new Blob([inputText.value]).size
})

const byteCountType = computed(() => {
  if (inputByteCount.value > MAX_BYTE_LENGTH * 0.9) return 'danger'
  if (inputByteCount.value > MAX_BYTE_LENGTH * 0.7) return 'warning'
  return 'info'
})

const truncateInput = (text) => {
  let truncated = text
  while (new Blob([truncated]).size > MAX_BYTE_LENGTH) {
    truncated = truncated.slice(0, -1)
  }
  return truncated
}

const handleInputChange = (value) => {
  if (new Blob([value]).size > MAX_BYTE_LENGTH) {
    const truncatedText = truncateInput(value)
    inputText.value = truncatedText
    ElMessage.warning('输入已超过6000字节，内容已自动截取')
  }
  handleTranslate()
}

const handleEngineChange = () => {
  handleTranslate()
}

const handleTranslate = () => {
  if (inputText.value.trim() === '') {
    translatedText.value = ''
    return
  }

  isTranslating.value = true
  // 模拟翻译过程
  setTimeout(() => {
    translatedText.value = `使用 ${translationEngine.value} 从 ${sourceLanguage.value} 翻译到 ${targetLanguage.value}: ${inputText.value}`
    isTranslating.value = false
  }, 1000)
}

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