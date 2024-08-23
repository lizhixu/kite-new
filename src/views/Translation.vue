<template>
  <el-card class="translation-container">
    <div class="language-bar">
      <el-select v-model="sourceLanguage" @change="handleTranslate" size="large" class="language-select">
        <el-option value="auto" label="自动检测" />
        <el-option v-for="lang in languages" :key="lang.value" :value="lang.value" :label="lang.label" />
      </el-select>
      <el-button @click="swapLanguages" :icon="Refresh" circle class="swap-btn" />
      <el-select v-model="targetLanguage" @change="handleTranslate" size="large" class="language-select">
        <el-option v-for="lang in languages" :key="lang.value" :value="lang.value" :label="lang.label" />
      </el-select>
    </div>
    <div class="translation-content">
      <div class="input-area">
        <el-input
            v-model="inputText"
            type="textarea"
            :rows="1"
            :placeholder="'请输入要翻译的文本（最多 6000 bytes）'"
            @input="handleInputChange"
            resize="none"
            class="translation-area"
            ref="inputTextarea"
            :maxlength="6000"
            show-word-limit
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
            :rows="1"
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
  </el-card>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, CopyDocument, Delete } from '@element-plus/icons-vue'

const languages = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英语' },
  { value: 'es', label: '西班牙语' },
  { value: 'fr', label: '法语' },
  { value: 'de', label: '德语' },
  { value: 'ja', label: '日语' },
]

const sourceLanguage = ref('auto')
const targetLanguage = ref('en')
const inputText = ref('')
const translatedText = ref('')
const isTranslating = ref(false)
const inputTextarea = ref(null)
const outputTextarea = ref(null)

const MIN_TEXTAREA_HEIGHT = 200
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

const handleInputChange = (value) => {
  if (new Blob([value]).size > MAX_BYTE_LENGTH) {
    ElMessage.warning('输入已达到最大长度限制')
    inputText.value = value.slice(0, -1)
    return
  }
  handleTranslate()
  nextTick(() => {
    adjustTextareaHeight()
  })
}

const handleTranslate = () => {
  if (inputText.value.trim() === '') {
    translatedText.value = ''
    return
  }

  isTranslating.value = true
  // 模拟翻译过程
  setTimeout(() => {
    translatedText.value = `Translated from ${sourceLanguage.value} to ${targetLanguage.value}: ${inputText.value}`
    isTranslating.value = false
    nextTick(() => {
      adjustTextareaHeight()
    })
  }, 1000)
}

const adjustTextareaHeight = () => {
  if (inputTextarea.value && outputTextarea.value) {
    const inputEl = inputTextarea.value.$el.querySelector('textarea')
    const outputEl = outputTextarea.value.$el.querySelector('textarea')

    // 重置高度
    inputEl.style.height = 'auto'
    outputEl.style.height = 'auto'

    // 获取内容高度
    const inputHeight = inputEl.scrollHeight
    const outputHeight = outputEl.scrollHeight

    // 设置为较大的高度，但不小于最小高度
    const maxHeight = Math.max(inputHeight, outputHeight, MIN_TEXTAREA_HEIGHT)
    inputEl.style.height = `${maxHeight}px`
    outputEl.style.height = `${maxHeight}px`
  }
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
  nextTick(() => {
    adjustTextareaHeight()
  })
}

watch([sourceLanguage, targetLanguage], handleTranslate)

// 初始调整
nextTick(() => {
  adjustTextareaHeight()
})
</script>

<style scoped>
.translation-container {
  width: 1110px;
  margin: 0 auto;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.language-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.language-select {
  width: 160px;
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
  flex-grow: 1;
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
  bottom: 10px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.copy-btn:hover, .clear-btn:hover {
  opacity: 1;
}

.clear-btn {
  bottom: 50px; /* 将清空按钮放在复制按钮上方 */
}

:deep(.el-textarea__inner) {
  font-size: 16px;
  line-height: 1.5;
  min-height: 200px !important;
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
</style>