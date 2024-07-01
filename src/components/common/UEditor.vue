<template>
  <froala :tag="'textarea'" :config="config" v-model:value="model"></froala>
</template>

<script setup>
//Import Froala Editor
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/languages/zh_cn';
//Import third party plugins
import 'froala-editor/js/third_party/embedly.min';
import 'froala-editor/js/third_party/font_awesome.min';
import 'froala-editor/js/third_party/spell_checker.min';
import 'froala-editor/js/third_party/image_tui.min';
// Import Froala Editor css files.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import {ref, reactive} from 'vue'

const config = {
  language: 'zh_cn',
  toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'inlineClass', 'markdown', 'emoticons', 'fullscreen', 'undo', 'redo'],
  quickInsertEnabled: false,
  placeholderText: '请输入评论内容...',
  events: {
    initialized: function () {
      console.log('initialized')
    }
  }
}
const model = ref('');
</script>

<style lang="scss">
</style>

