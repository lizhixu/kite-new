<template>
  <el-row class="login-wrapper" align="middle">
    <el-col :span="12" class="lottie-col">
      <lottie-player
        autoplay
        loop
        mode="normal"
        src="/animation.json"
        style="width: 320px; height: 320px;"
      >
      </lottie-player>
    </el-col>
    <el-col :span="12" class="login-content-col">
      <div class="login-box">
        <h3 class="login-title">第三方开发者快捷登录</h3>
        <p class="login-subtitle">
          登录后可同步显示开发者头像并畅享畅言评论；管理员登录后可直接在线编辑文章。
        </p>

        <div class="oauth-buttons">
          <el-button
            class="oauth-btn github-btn"
            size="large"
            @click="handleOAuthLogin('github')"
          >
            <svg class="oauth-icon" viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            使用 GitHub 账号登录
          </el-button>

          <el-button
            class="oauth-btn gitee-btn"
            size="large"
            @click="handleOAuthLogin('gitee')"
          >
            <svg class="oauth-icon" viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
              <path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m259.2-569.6H512v128h131.2c-22.4 67.2-86.4 115.2-160 115.2-92.8 0-169.6-76.8-169.6-169.6s76.8-169.6 169.6-169.6c44.8 0 86.4 16 118.4 44.8l92.8-92.8C643.2 268.8 582.4 240 512 240c-150.4 0-272 121.6-272 272s121.6 272 272 272c140.8 0 259.2-108.8 268.8-246.4 3.2-28.8-9.6-54.4-9.6-83.2z"/>
            </svg>
            使用 Gitee 账号登录
          </el-button>
        </div>

        <div class="dev-mock-wrapper">
          <el-divider content-position="center">
            <span class="divider-text">本地开发 / 管理员快速模拟</span>
          </el-divider>
          <div class="mock-btn-group">
            <el-button size="small" type="success" plain @click="mockLogin('lizhixu')">
              快速模拟管理员 (lizhixu)
            </el-button>
            <el-button size="small" plain @click="mockLogin('guest_developer')">
              模拟普通访客
            </el-button>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import '@lottiefiles/lottie-player';
import { inject } from 'vue';
import { ElNotification } from 'element-plus';
import { useRoute } from 'vue-router';
import { loadComment } from '@/utils/changyan';

const route = useRoute();
const token = inject('token');
const blogConfig = inject('blogConfig');
const emit = defineEmits(['close-dialog']);

function handleOAuthLogin(provider) {
  const currentOrigin = window.location.origin;
  const redirectUri = encodeURIComponent(`${currentOrigin}/api/auth/${provider}/callback`);
  const oauthConfig = blogConfig?.oauth || {};

  if (provider === 'github') {
    const clientId = oauthConfig.github_client_id;
    if (!clientId || clientId.includes('...')) {
      ElNotification({
        title: 'OAuth 提示',
        message: '未配置线上 GitHub Client ID，已为你提供下方“快速模拟”以便本地直接体验。',
        type: 'info',
        duration: 4000,
      });
      return;
    }
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
    window.location.href = authUrl;
  } else if (provider === 'gitee') {
    const clientId = oauthConfig.gitee_client_id;
    if (!clientId || clientId.includes('...')) {
      ElNotification({
        title: 'OAuth 提示',
        message: '未配置线上 Gitee Client ID，已为你提供下方“快速模拟”以便本地直接体验。',
        type: 'info',
        duration: 4000,
      });
      return;
    }
    const authUrl = `https://gitee.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = authUrl;
  }
}

function mockLogin(username) {
  // 生成标准 JWT Payload 格式的本地开发 Mock Token
  const isAdmin = blogConfig?.admin?.github?.includes(username) || blogConfig?.admin?.gitee?.includes(username);
  const payload = {
    id: username === 'lizhixu' ? 1 : 99,
    username,
    avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
    provider: 'github',
    isAdmin,
  };

  // Base64 编码为简单 JWT 形式
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const mockJwt = `${header}.${body}.mock_signature`;

  localStorage.setItem('token', mockJwt);
  localStorage.setItem('user_info', JSON.stringify({ id: payload.id, attributes: payload }));
  token.value = mockJwt;

  if (route.name === 'article_detail') {
    loadComment();
  }

  emit('close-dialog');

  ElNotification({
    title: '登录成功',
    message: `欢迎回来，${username}！${isAdmin ? '（已识别为博客管理员）' : ''}`,
    type: 'success',
    duration: 3000,
  });
}
</script>

<style scoped>
.login-wrapper {
  padding: 10px 0;
}

.lottie-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-content-col {
  padding: 0 20px 0 10px;
}

.login-box {
  display: flex;
  flex-direction: column;
}

.login-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 13px;
  color: #909399;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: none;
}

.oauth-icon {
  margin-right: 10px;
}

.github-btn {
  background-color: #24292e;
  color: #ffffff;
}

.github-btn:hover {
  background-color: #1a1e22;
  color: #ffffff;
}

.gitee-btn {
  background-color: #c71d23;
  color: #ffffff;
}

.gitee-btn:hover {
  background-color: #ab171c;
  color: #ffffff;
}

.dev-mock-wrapper {
  margin-top: 24px;
}

.divider-text {
  font-size: 12px;
  color: #a8abb2;
}

.mock-btn-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}
</style>
