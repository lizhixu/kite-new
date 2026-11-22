# 阿里云 ESA (边缘安全加速) 博客部署与配置手册

本项目已完成从传统 Strapi (Node.js + MySQL) 架构到 **Git + Markdown + 阿里云 ESA 边缘无服务器** 架构的全面重构。

---

## 1. 架构核心优势
1. **零常驻服务器**：纯静态产物由 ESA Pages 全球分布式节点托管分发，彻底摆脱 24 小时开机的云服务器与数据库。
2. **全站动态 SEO 网关**：
   - 打包产物永远保持只有 **1 个通用的 `index.html`** + 静态资源，避免生成成百上千个 HTML 撞上平台文件数量限制。
   - ESA 边缘函数 (`gateway.js`) 就近拦截页面请求，自动动态注入 `<title>`、Meta 标签和语义化 HTML。
   - 注入结果通过 ESA Edge Cache（`s-maxage=86400`）就近缓存，计算消耗几乎为零，爬虫秒级收录。
3. **免后台极简编辑**：
   - 博客管理员通过 GitHub 或 Gitee 登录后，文章详情页直接展示「在 GitHub 编辑」按钮。
   - 点击直跳网页在线编辑器，改完 Commit 提交后，ESA Pages 自动感知推送并完成秒级构建。
4. **轻量动态能力**：
   - 文章阅读量由 `views.js` + ESA 边缘存储 (Edge KV) 实现自增。
   - 全文搜索由单一全站数据 (`site-data.json`) + `minisearch` 驱动，支持 `⌘K` 毫秒级呼出。

---

## 2. 阿里云 ESA 控制台配置步骤

### 第一步：创建 ESA Pages 静态站点
1. 登录 [阿里云 ESA 控制台](https://esa.console.aliyun.com/)。
2. 进入 **函数和 Pages** -> **Pages** -> 点击 **创建项目**。
3. 授权绑定你的 GitHub 仓库（`lizhixu/kite-new`）。
4. **构建设置**：
   - **分支**：`main`
   - **构建命令**：`yarn && node scripts/generate-data.mjs && yarn build`
   - **构建输出目录**：`dist`
5. 点击 **立即部署**。首次部署完成后，你将获得一个测试访问域名。

### 第二步：创建 ESA 边缘存储 (Edge KV)
在 ESA 控制台左侧进入 **边缘存储 (EdgeKV)**：
1. 点击 **创建存储空间 (Namespace)**：
   - 空间 1：`blog_views`（用于持久化各文章的动态阅读计数）
   - 空间 2：`blog_users`（用于持久化 GitHub/Gitee 授权登录的用户资料）

### 第三步：部署 ESA 边缘函数 (Edge Routine)
在 ESA 控制台左侧进入 **边缘函数**：
1. **部署网关函数 `gateway`**：
   - 新建函数，将 `esa/edge-functions/gateway.js` 代码粘贴进去。
   - 绑定触发路由：`/*`（重定向/接管模式）。
2. **部署阅读量函数 `views`**：
   - 新建函数，将 `esa/edge-functions/views.js` 代码粘贴进去。
   - 关联 Edge KV 空间：绑定 `blog_views`。
   - 绑定触发路由：`/api/views/*`。
3. **部署第三方登录函数 `auth`**：
   - 新建函数，将 `esa/edge-functions/auth.js` 代码粘贴进去。
   - 关联 Edge KV 空间：绑定 `blog_users`。
   - 配置环境变量（可选）：`GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`、`GITEE_CLIENT_ID`、`GITEE_CLIENT_SECRET`。
   - 绑定触发路由：`/api/auth/*` 和 `/api/users/*`。

### 第四步：配置自定义域名与 SSL
1. 在 ESA 控制台添加你的站点主域名（如 `lizhixu.cn`）。
2. 免费申请并开启 ESA 的全站 HTTPS 证书。
3. 在 DNS 解析服务商处，将域名 CNAME 解析切换至阿里云 ESA 提供的加速 CNAME。
4. 开启 **Brotli / Gzip 压缩** 与 **DDoS / WAF 基础防护**。

---

## 3. 本地日常写作与调试工作流

### 新增文章
直接在 `content/posts/` 目录下新建 Markdown 文件（例如 `2024-04-01-my-new-post.md`）：
```markdown
---
title: "我的新文章标题"
category: "前端技术"
tags: ["Vue3", "Vite"]
chosen: false
---

这里开始书写文章正文...
```
> **提示**：`createdAt` 与 `updatedAt` 完全无需手动填写，构建时会自动从 Git 历史提交记录中提取。

### 本地预览
```bash
yarn dev
```
打开 `http://localhost:5173` 即可实时预览全站文章、分类、标签云、全文搜索及登录。

### 发布上线
```bash
git add .
git commit -m "feat: 发布新文章"
git push origin main
```
推送后，ESA Pages 会自动触发构建并秒级分发至全球边缘节点！
