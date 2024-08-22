<script setup lang="ts">
import {ref} from "vue";
import UEditor from "@/components/common/UEditor.vue";

const childCommentVisible = ref(false)
</script>

<template>
  <el-row>
    <el-col :span="1">
      <el-avatar shape="circle" :size="45" src="">登录</el-avatar>
    </el-col>
    <el-col :span="21" :offset="1">
      <div class="comment-first">
        <div style="color:#515767;">你滴滴滴</div>
        <div class="mgt10">有对象先买房，没对象先买车，买完车就有对象</div>
        <div class="comment mgt10">
          <span class="mgr20">2021-01-01 12:00</span>
          <el-link :underline="false" @click="childCommentVisible = true">
            <el-icon>
              <ChatLineSquare/>
            </el-icon>
            <span>回复</span>
          </el-link>
        </div>
        <div class="comment-child mgt20">
          <el-row>
            <el-col :span="1">
              <el-avatar shape="circle" :size="45" src="">登录</el-avatar>
            </el-col>
            <el-col :span="21" :offset="1">
              <div class="comment-first">
                <div style="color:#515767;">你滴滴滴</div>
                <div class="mgt10">有对象先买房，没对象先买车，买完车就有对象</div>
                <div class="comment mgt10">
                  <span class="mgr20">2021-01-01 12:00</span>
                  <el-link :underline="false">
                    <el-icon>
                      <ChatLineSquare/>
                    </el-icon>
                    <span>回复</span>
                  </el-link>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-dialog v-model="childCommentVisible" title="回复@xxx" width="700" :draggable="true" style="border-radius: 10px;">
    <UEditor :editorConfig="{placeholder: '请输入回复内容...', autoFocus: true}"/>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="childCommentVisible = false">取消</el-button>
        <el-button type="primary" @click="childCommentVisible = false">
          回复
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.comment {
  color: #515767;
}
.el-dialog{

}
</style>