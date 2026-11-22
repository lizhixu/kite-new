/**
 * 阿里云 ESA 边缘安全加速 - GitHub / Gitee OAuth 快捷登录与鉴权边缘函数
 * 
 * 路由匹配：
 * - GET /api/auth/github/callback?code=xxx
 * - GET /api/auth/gitee/callback?code=xxx
 * - GET /api/users/me
 * 
 * 存储介质：
 * - 阿里云 ESA 边缘存储 EdgeKV (Namespace: blog_users)
 */

// 管理员配置与 OAuth 密钥（推荐在 ESA 控制台环境变量中配置）
const ADMIN_CONFIG = {
  github: ['lizhixu'],
  gitee: ['lizhixu'],
};

// 工具函数：创建简单 JWT
function createJwt(payload, secret = 'esa_blog_jwt_secret') {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64UrlEncode = (obj) => {
    const json = typeof obj === 'string' ? obj : JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const headerB64 = base64UrlEncode(header);
  const payloadB64 = base64UrlEncode(payload);
  const signature = 'esa_sign'; // 边缘轻量签名

  return `${headerB64}.${payloadB64}.${signature}`;
}

export default async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. 获取当前登录用户信息接口 /api/users/me
  if (pathname === '/api/users/me') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s*/i, '');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payloadJson = decodeURIComponent(escape(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))));
        const user = JSON.parse(payloadJson);
        return new Response(JSON.stringify({ data: { id: user.id, attributes: user } }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }
  }

  // 2. GitHub OAuth 回调处理
  if (pathname === '/api/auth/github/callback') {
    const code = url.searchParams.get('code');
    const clientId = request.headers.get('GITHUB_CLIENT_ID') || 'YOUR_GITHUB_CLIENT_ID';
    const clientSecret = request.headers.get('GITHUB_CLIENT_SECRET') || 'YOUR_GITHUB_CLIENT_SECRET';

    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }

    try {
      // 换取 Access Token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // 获取用户信息
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`,
          'User-Agent': 'ESA-Blog-App',
        },
      });
      const ghUser = await userRes.json();

      const username = ghUser.login;
      const isAdmin = ADMIN_CONFIG.github.includes(username);

      const userProfile = {
        id: `gh_${ghUser.id}`,
        username,
        avatar_url: ghUser.avatar_url,
        provider: 'github',
        isAdmin,
      };

      // 存入 ESA EdgeKV
      try {
        if (typeof EdgeKV !== 'undefined') {
          const kv = new EdgeKV({ namespace: 'blog_users' });
          await kv.put(`user:${userProfile.id}`, JSON.stringify(userProfile));
        }
      } catch (err) {
        console.error('EdgeKV user store error:', err);
      }

      // 签发 JWT 并重定向回博客前端首页
      const jwtToken = createJwt(userProfile);
      return Response.redirect(`${url.origin}/?token=${encodeURIComponent(jwtToken)}`, 302);
    } catch (err) {
      return new Response(`GitHub OAuth failed: ${err.message}`, { status: 500 });
    }
  }

  // 3. Gitee OAuth 回调处理
  if (pathname === '/api/auth/gitee/callback') {
    const code = url.searchParams.get('code');
    const clientId = request.headers.get('GITEE_CLIENT_ID') || 'YOUR_GITEE_CLIENT_ID';
    const clientSecret = request.headers.get('GITEE_CLIENT_SECRET') || 'YOUR_GITEE_CLIENT_SECRET';
    const redirectUri = `${url.origin}/api/auth/gitee/callback`;

    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }

    try {
      // 换取 Access Token
      const tokenRes = await fetch('https://gitee.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // 获取 Gitee 用户信息
      const userRes = await fetch(`https://gitee.com/api/v5/user?access_token=${accessToken}`);
      const giteeUser = await userRes.json();

      const username = giteeUser.login;
      const isAdmin = ADMIN_CONFIG.gitee.includes(username);

      const userProfile = {
        id: `gitee_${giteeUser.id}`,
        username,
        avatar_url: giteeUser.avatar_url,
        provider: 'gitee',
        isAdmin,
      };

      // 存入 ESA EdgeKV
      try {
        if (typeof EdgeKV !== 'undefined') {
          const kv = new EdgeKV({ namespace: 'blog_users' });
          await kv.put(`user:${userProfile.id}`, JSON.stringify(userProfile));
        }
      } catch (err) {
        console.error('EdgeKV user store error:', err);
      }

      const jwtToken = createJwt(userProfile);
      return Response.redirect(`${url.origin}/?token=${encodeURIComponent(jwtToken)}`, 302);
    } catch (err) {
      return new Response(`Gitee OAuth failed: ${err.message}`, { status: 500 });
    }
  }

  return new Response('Not Found', { status: 404 });
}
