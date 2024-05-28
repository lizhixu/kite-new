<script setup>
import "@lottiefiles/lottie-player";
import {reactive, ref} from 'vue'
import {Lock, User} from "@element-plus/icons-vue";

const isLogin = ref(true);
const loginFormRef = ref();
const registerFormRef = ref();
const checkEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入邮箱'));
  }
  setTimeout(() => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      callback(new Error('请输入正确邮箱'));
    } else {
      callback();
    }
  }, 1000);
};
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    callback();
  }
};
const loginForm = reactive({
  password: '',
  email: '',
});

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== registerForm.password) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
});
const rules = reactive({
  email: [{validator: checkEmail, trigger: 'blur'}],
  password: [{validator: validatePass, trigger: 'blur'}],
  checkPass: [{validator: validatePass, trigger: 'blur'}],
});
const submitForm = (formEl) => {
  if (!formEl)
    return;
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!');
    } else {
      console.log('error submit!');
    }
  });
};
const resetForm = (formEl) => {
  if (!formEl)
    return;
  formEl.resetFields();
};
</script>

<template>
  <el-row>
    <el-col :span="12">
      <lottie-player
          autoplay
          loop
          mode="normal"
          src="/animation.json"
          style="width: 320px"
      >
      </lottie-player>
    </el-col>
    <el-col :span="12">
      <!--登录-->
      <el-form v-if="isLogin"
               ref="loginFormRef"
               size="large"
               :model="loginForm"
               status-icon
               :rules="rules"
               label-width="auto"
               class="loginForm"
      >
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱">
            <template #suffix>
              <el-icon class="el-input__icon">
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="passwordword" placeholder="请输入密码" autocomplete="off">
            <template #suffix>
              <el-icon class="el-input__icon">
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="2">
            <el-link type="primary" @click="isLogin = !isLogin">注册</el-link>
          </el-col>
          <el-col :span="4" :offset="18">
            <el-link>忘记密码</el-link>
          </el-col>
        </el-row>
        <el-form-item style="margin-top: 10px;">
          <el-button type="primary" @click="submitForm(loginFormRef)" style="width: 100%;">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <!--注册-->
      <el-form v-if="!isLogin"
               ref="registerFormRef"
               size="large"
               :model="loginForm"
               status-icon
               :rules="rules"
               label-width="auto"
               class="registerForm"
      >
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱">
            <template #suffix>
              <el-icon class="el-input__icon">
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" autocomplete="off">
            <template #suffix>
              <el-icon class="el-input__icon">
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input v-model="loginForm.checkPass" type="password" placeholder="请输入确认密码" autocomplete="off">
            <template #suffix>
              <el-icon class="el-input__icon">
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-link type="primary" @click="isLogin = !isLogin">登录</el-link>
        <el-form-item style="margin-top: 10px;">
          <el-button type="primary" @click="submitForm(loginFormRef)" style="width: 100%;">
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.loginForm {
  margin-top: 50px;
}

.registerForm {
  margin-top: 30px;
}
</style>