<script setup>
import "@lottiefiles/lottie-player";
import {inject, reactive, ref} from 'vue'
import {Lock, User} from "@element-plus/icons-vue";
import {login, register} from "@/utils/strapi";
import {ElNotification} from "element-plus";
import {useRoute} from "vue-router";
import {loadComment} from "@/utils/changyan";

const route = useRoute();

const token = inject('token');
const emit = defineEmits(['close-dialog'])

const loading = ref(false);
const loginFormRef = ref();
const registerFormRef = ref();
const isLogin = ref(true);
const checkUserName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入用户名'));
  } else {
    callback();
  }
};
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
  identifier: '',
});

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不一致!"))
  } else {
    callback()
  }
}
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  checkPass: '',
});
const rules = reactive({
  username: [{validator: checkUserName, trigger: 'blur'}],
  identifier: [{validator: checkUserName, trigger: 'blur'}],
  email: [{validator: checkEmail, trigger: 'blur'}],
  password: [{validator: validatePass, trigger: 'blur'}],
  checkPass: [{validator: validatePass2, trigger: 'blur'}],
});
const submitForm = (formEl) => {
  if (!formEl)
    return;
  formEl.validate((valid) => {
    if (valid) {
      const formData = isLogin.value ? loginForm : registerForm;
      if (isLogin.value) {
        login(formData).then((res) => {
          localStorage.setItem('token', res.jwt);
          token.value = res.jwt;
          if (route.name === 'article_detail') {
            loadComment()
          }
          resetForm(formEl);
          emit('close-dialog')
          ElNotification({
            duration: 2000,
            dangerouslyUseHTMLString: true,
            message: '登录成功！！',
            type: 'success',
          })
        }).catch((error) => {
          ElNotification({
            duration: 5000,
            message: error.response.data.error.message,
            type: 'error'
          })
        });
      } else {
        loading.value = true;
        register(formData).then((res) => {
          loading.value = false;
          emit('close-dialog')
          ElNotification({
            title: '验证电子邮箱',
            duration: 6000,
            dangerouslyUseHTMLString: true,
            message: `
              <p>我们已向
                <el-link type="primary">${formData.email}</el-link>
                发送电子邮件以确保你拥有它，请查看你的收件箱并确认信息。
              </p>`,
            type: 'success'
          })
          resetForm(formEl);
        }).catch((error) => {
          loading.value = false;
          ElNotification({
            duration: 5000,
            message: error.response.data.error.message,
            type: 'error'
          })
        });
      }
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
               class="loginForm"
      >
        <el-form-item prop="identifier">
          <el-input v-model="loginForm.identifier" placeholder="请输入邮箱">
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
               :model="registerForm"
               status-icon
               :rules="rules"
               class="registerForm"
               v-loading="loading"
               element-loading-text="注册中..."
      >
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名">
            <template #suffix>
              <el-icon class="el-input__icon">
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱">
            <template #suffix>
              <el-icon class="el-input__icon">
                <Message/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" autocomplete="off">
            <template #suffix>
              <el-icon class="el-input__icon">
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input v-model="registerForm.checkPass" type="password" placeholder="请输入确认密码" autocomplete="off">
            <template #suffix>
              <el-icon class="el-input__icon">
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-link type="primary" @click="isLogin = !isLogin">登录</el-link>
        <el-form-item style="margin-top: 10px;">
          <el-button type="primary" @click="submitForm(registerFormRef)" style="width: 100%;">
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

.email-confirm {
  text-align: center;
}
</style>