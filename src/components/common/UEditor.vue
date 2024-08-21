<template>
  <div :style="toolbarStyle">
    <Toolbar
        style="border-bottom: 1px solid #ccc;"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        :style="editorStyle"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onFocus="editorFocus"
        @onBlur="editorStyle.height = '100px';toolbarStyle.border = '1px solid #ccc'"
        @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {onBeforeUnmount, ref, shallowRef} from "vue";

const editorStyle = ref({height: '100px', overflowY: 'hidden'});
const toolbarStyle = ref({border: '1px solid #ccc'});
const editorRef = shallowRef();
const valueHtml = ref('')
const toolbarConfig = {
  toolbarKeys: ['headerSelect', 'bold', 'italic', 'codeBlock', 'emotion', {
    key: 'group-more-style', // 必填，要以 group 开头
    title: '更多样式', // 必填
    menuKeys: ["through", "code", "clearStyle"] // 下级菜单 key ，必填
  }]
};
const editorConfig = {placeholder: '请输入评论内容...', autoFocus: false};
const mode = 'simple'; // or 'simple'
function handleCreated(editor) {
  editorRef.value = editor // 记录 editor 实例，重要！
}

function editorFocus(editor) {
  if (!editor.isFocused()) return
  editorStyle.value.height = '200px';
  toolbarStyle.value.border = '1px solid #5cb9ff'
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
</style>

