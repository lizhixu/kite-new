<template>
  <div id="ckeditor">
    <ckeditor
        ref="editorRef"
        v-model="editorDesign"
        :editor="editor"
        :config="editorConfig"
        :disabled="disabled"
        @ready="onEditorReady"
        @focus="onEditorFocus"
        @blur="onEditorBlur"
        @input="onEditorInput"
        @destroy="onEditorDestroy"
    ></ckeditor>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn.js' //引入中文包
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false, //是否禁用
  },
})
const editor = ClassicEditor
const editorDesign = ref('') //默认内容

const editorConfig = reactive({
  language: 'zh-cn',
  toolbar: {
    items: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'],
  },
  image: {
    toolbar: ['imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  ckfinder: {
    uploadUrl: `/uploadfile`, // 上传图片接口
    options: {
      resourceType: 'Images',
    },
  },
})

const emit = defineEmits(['ready', 'focus', 'blur', 'input', 'destroy'])

const editorRef = ref(null)
const onEditorReady = () => {
  console.log('准备好了')
  emit('ready')
}

const onEditorFocus = () => {
  console.log('聚焦')
  emit('focus')
}
const onEditorBlur = () => {
  console.log('失去焦点')
  emit('blur')
}

const onEditorInput = () => {
  console.log('正在录入')
  emit('input')
}

const onEditorDestroy = () => {
  console.log('销毁')
  emit('destroy')
}
</script>

<style lang="scss">
#ckeditor {
  .ck-editor__editable {
    min-height: 100px;
    max-height: 500px;
  }
}
</style>

