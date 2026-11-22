/**
 * 阿里云 ESA 边缘安全加速 - 全局统一 SEO 动态网关与边缘缓存网关
 * 
 * 核心功能：
 * 1. 静态资源自动放行至 ESA 边缘存储 / Pages 分发；
 * 2. 页面级路由 (/、/article_detail/:id、/special/:id、/tags) 统一拦截；
 * 3. 统一从单一数据源 (/data/site-data.json) 提取文章/分类/标签元数据；
 * 4. 在边缘就近注入专属 <title>、<meta> 和语义 HTML 插槽；
 * 5. 注入结果写入 ESA 边缘缓存 (s-maxage=86400)，毫秒级就近响应蜘蛛与访客，零服务器负载。
 */

const BOT_USER_AGENTS = [
  'Baiduspider',
  'Googlebot',
  'bingbot',
  'Bytespider',
  'Sogou',
  '360Spider',
  'YandexBot',
  'DuckDuckBot',
  'facebookexternalhit',
  'Twitterbot',
];

function isBot(userAgent = '') {
  return BOT_USER_AGENTS.some((bot) => userAgent.toLowerCase().includes(bot.toLowerCase()));
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 边缘运行时内存全局缓存单一全站数据
let edgeCachedSiteData = null;
let edgeSiteDataTime = 0;

async function getEdgeSiteData(origin) {
  const now = Date.now();
  // 边缘 isolate 内存缓存 5 分钟
  if (edgeCachedSiteData && now - edgeSiteDataTime < 300000) {
    return edgeCachedSiteData;
  }
  try {
    const res = await fetch(`${origin}/data/site-data.json`);
    if (res.ok) {
      edgeCachedSiteData = await res.json();
      edgeSiteDataTime = now;
      return edgeCachedSiteData;
    }
  } catch (e) {
    console.error('Failed to fetch site-data.json at edge:', e);
  }
  return edgeCachedSiteData || {};
}

export default async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const userAgent = request.headers.get('User-Agent') || '';
  const isCrawler = isBot(userAgent);

  // 1. 静态资源与 API 请求直接放行
  const isStaticAsset =
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/data/') ||
    pathname.startsWith('/api/') ||
    /\.(js|css|png|jpg|jpeg|gif|svg|ico|json|txt|xml|woff|woff2|ttf)$/i.test(pathname);

  if (isStaticAsset) {
    return fetch(request);
  }

  // 2. 获取基础 index.html 模板
  const indexUrl = `${url.origin}/index.html`;
  const indexResponse = await fetch(indexUrl);
  if (!indexResponse.ok) {
    return indexResponse;
  }
  let html = await indexResponse.text();

  // 3. 从单一数据源拉取全站数据
  const siteData = await getEdgeSiteData(url.origin);
  const siteConfig = siteData.config?.data?.attributes || {};
  const categories = siteData.categories?.data || [];
  const articles = siteData.articles || [];

  const siteTitle = siteConfig.title || "Kite's Blog - 专注前端与边缘计算";
  let pageTitle = siteTitle;
  let pageDescription = siteConfig.description || 'Kite 的个人技术博客，分享前端开发、边缘计算、Node.js 与架构实践。';
  let pageKeywords = siteConfig.keywords || 'Vue3, Vite, 阿里云 ESA, Serverless, 前端技术, 博客';
  let semanticBody = '';

  try {
    // 4. 根据页面路由匹配动态注入数据
    if (pathname.startsWith('/article_detail/')) {
      // --- 文章详情页 ---
      const articleId = pathname.replace('/article_detail/', '').split('/')[0];
      const matched = articles.find((a) => String(a.id) === String(articleId));
      if (matched && matched.attributes) {
        const article = matched.attributes;
        pageTitle = `${article.title} - ${siteTitle}`;
        pageDescription = article.description || pageDescription;
        const tags = (article.tags?.data || []).map((t) => t.attributes?.name || t.name).join(', ');
        if (tags) pageKeywords = tags;

        semanticBody = `
          <article style="max-width:800px;margin:20px auto;padding:0 20px;">
            <h1>${escapeHtml(article.title)}</h1>
            <div style="color:#666;font-size:14px;margin-bottom:20px;">
              <span>更新时间：${article.articleUpdatedAt || article.updatedAt}</span> | 
              <span>分类：${escapeHtml(article.category?.data?.attributes?.name || '技术')}</span> | 
              <span>标签：${escapeHtml(tags)}</span>
            </div>
            <p style="font-weight:bold;color:#444;">${escapeHtml(article.description)}</p>
            <div class="content">${escapeHtml(article.content || '')}</div>
          </article>
        `;
      }
    } else if (pathname.startsWith('/special/')) {
      // --- 专栏分类页 ---
      const categoryId = pathname.replace('/special/', '').split('/')[0];
      const currentCat = categories.find((c) => String(c.id) === String(categoryId));
      if (currentCat) {
        const catName = currentCat.attributes?.name || currentCat.name;
        const catDesc = currentCat.attributes?.describe || currentCat.describe;
        pageTitle = `专栏：${catName} - ${siteTitle}`;
        pageDescription = catDesc || pageDescription;

        const matchedArticles = articles.filter(
          (a) => String(a.attributes?.category?.data?.id) === String(categoryId)
        );

        semanticBody = `
          <section style="max-width:800px;margin:20px auto;padding:0 20px;">
            <h1>专栏分类：${escapeHtml(catName)}</h1>
            <p style="color:#666;">${escapeHtml(catDesc)}</p>
            <h2>文章列表</h2>
            <ul>
              ${matchedArticles
                .map(
                  (a) =>
                    `<li><a href="/article_detail/${a.id}">${escapeHtml(a.attributes?.title)}</a> - ${escapeHtml(
                      a.attributes?.description
                    )}</li>`
                )
                .join('')}
            </ul>
          </section>
        `;
      }
    } else if (pathname === '/tags') {
      // --- 标签页 ---
      const tagName = url.searchParams.get('name') || '';
      pageTitle = tagName ? `标签：${tagName} - ${siteTitle}` : `标签云 - ${siteTitle}`;
      pageDescription = tagName ? `包含标签 ${tagName} 的所有文章归档` : pageDescription;
      pageKeywords = tagName || pageKeywords;

      if (tagName) {
        const matchedArticles = articles.filter((a) => {
          const tags = a.attributes?.tags?.data || [];
          return tags.some((t) => t.attributes?.name === tagName || t.name === tagName);
        });

        semanticBody = `
          <section style="max-width:800px;margin:20px auto;padding:0 20px;">
            <h1>标签：#${escapeHtml(tagName)}</h1>
            <h2>文章列表</h2>
            <ul>
              ${matchedArticles
                .map(
                  (a) =>
                    `<li><a href="/article_detail/${a.id}">${escapeHtml(a.attributes?.title)}</a></li>`
                )
                .join('')}
            </ul>
          </section>
        `;
      }
    } else if (pathname === '/') {
      // --- 首页 ---
      semanticBody = `
        <main style="max-width:800px;margin:20px auto;padding:0 20px;">
          <h1>${escapeHtml(siteTitle)}</h1>
          <p>${escapeHtml(pageDescription)}</p>
          <h2>最新文章</h2>
          <ul>
            ${articles
              .slice(0, 10)
              .map(
                (a) =>
                  `<li><a href="/article_detail/${a.id}">${escapeHtml(a.attributes?.title)}</a> - ${escapeHtml(
                    a.attributes?.description
                  )}</li>`
              )
              .join('')}
          </ul>
        </main>
      `;
    }
  } catch (err) {
    console.error('Edge SEO gateway error:', err);
  }

  // 5. 将动态 Meta 与语义内容注入 HTML 模板
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);
  
  const seoMetaTags = `
    <meta name="description" content="${escapeHtml(pageDescription)}" />
    <meta name="keywords" content="${escapeHtml(pageKeywords)}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDescription)}" />
    <meta property="og:url" content="${url.href}" />
    <meta property="og:type" content="website" />
  `;
  html = html.replace('</head>', `${seoMetaTags}\n</head>`);

  // 如果包含语义内容，注入到 <div id="app"></div> 中（爬虫与非 JS 环境立即可读）
  if (semanticBody) {
    html = html.replace('<div id="app"></div>', `<div id="app">${semanticBody}</div>`);
  }

  // 6. 边缘就近缓存响应 (CDN 节点缓存 24 小时，极大提升爬虫与用户抓取响应速度)
  const headers = new Headers(indexResponse.headers);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Cache-Control', 'public, max-age=60, s-maxage=86400');
  headers.set('X-Edge-Prerender', 'ESA-Gateway');

  return new Response(html, {
    status: 200,
    headers,
  });
}
