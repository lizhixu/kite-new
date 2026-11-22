/**
 * 阿里云 ESA 边缘安全加速 - 文章阅读量统计边缘函数
 * 
 * 路由匹配：
 * - POST /api/views/:id  -> 阅读量 +1 并返回最新计数
 * - GET  /api/views/:id  -> 获取当前阅读量计数
 * 
 * 存储介质：
 * - 阿里云 ESA 边缘存储 EdgeKV (Namespace: blog_views)
 */

export default async function handleRequest(request) {
  const url = new URL(request.url);
  const match = url.pathname.match(/\/api\/views\/(\d+)/);

  if (!match) {
    return new Response(JSON.stringify({ error: 'Missing or invalid article ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const articleId = match[1];

  // 跨域预检处理
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // 初始化 ESA 边缘存储 EdgeKV (如未在控制台绑定则优雅降级为内存计数)
  let kv = null;
  try {
    if (typeof EdgeKV !== 'undefined') {
      kv = new EdgeKV({ namespace: 'blog_views' });
    }
  } catch (e) {
    console.warn('EdgeKV not initialized:', e);
  }

  if (request.method === 'POST') {
    let currentViews = 0;
    if (kv) {
      try {
        const stored = await kv.get(articleId);
        if (stored) currentViews = parseInt(stored, 10) || 0;
      } catch (err) {
        console.error('EdgeKV get error:', err);
      }

      currentViews += 1;

      try {
        await kv.put(articleId, String(currentViews));
      } catch (err) {
        console.error('EdgeKV put error:', err);
      }
    } else {
      currentViews = 1;
    }

    return new Response(JSON.stringify({ id: articleId, views: currentViews }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // GET 请求查询当前浏览量
  let views = 0;
  if (kv) {
    try {
      const stored = await kv.get(articleId);
      if (stored) views = parseInt(stored, 10) || 0;
    } catch (err) {
      console.error('EdgeKV get error:', err);
    }
  }

  return new Response(JSON.stringify({ id: articleId, views }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
