import axios from 'axios';
import _ from 'lodash-es';

// 全站单一数据缓存单例
let siteDataPromise = null;
let cachedSiteData = null;

/**
 * 获取全站单一数据对象 (site-data.json)
 * 全站仅需发一次轻量 HTTP 请求，后续全由内存直出
 */
export async function getSiteData() {
  if (cachedSiteData) {
    return cachedSiteData;
  }
  if (!siteDataPromise) {
    siteDataPromise = axios
      .get('/data/site-data.json', { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => {
        cachedSiteData = res.data || {};
        return cachedSiteData;
      })
      .catch((err) => {
        siteDataPromise = null;
        console.error('Failed to load /data/site-data.json:', err);
        return {};
      });
  }
  return siteDataPromise;
}

export async function find(model, params = {}) {
  const siteData = await getSiteData();

  // 1. blog-config
  if (model === 'blog-config') {
    return siteData.config || { data: { attributes: {} } };
  }

  // 2. categories
  if (model === 'categories') {
    return siteData.categories || { data: [] };
  }

  // 3. friends-chains
  if (model === 'friends-chains') {
    return siteData.friends || { data: [] };
  }

  // 4. tags
  if (model === 'tags') {
    const list = siteData.tags?.data || [];
    return {
      data: list,
      meta: {
        pagination: {
          total: list.length,
          start: 0,
          limit: list.length,
        },
      },
    };
  }

  // 5. articles 列表与过滤
  if (model === 'articles') {
    let list = [...(siteData.articles || [])];

    // 分类筛选: filters[category][id][$eq]
    const categoryFilter = params['filters[category][id][$eq]'] || params?.filters?.category?.id?.$eq;
    if (categoryFilter !== undefined && categoryFilter !== null) {
      list = list.filter((item) => String(item.attributes?.category?.data?.id) === String(categoryFilter));
    }

    // 标签筛选: filters[tags][$eq] 或 filters[tags][id][$eq]
    const tagFilter = params['filters[tags][$eq]'] || params?.filters?.tags?.$eq;
    if (tagFilter !== undefined && tagFilter !== null) {
      list = list.filter((item) => {
        const itemTags = item.attributes?.tags?.data || [];
        return itemTags.some((t) => String(t.id) === String(tagFilter) || String(t.attributes?.name) === String(tagFilter));
      });
    }

    // 精选推荐筛选 (Featured.vue): filters[chosen][$eq]
    const chosenFilter = params['filters[chosen][$eq]'] || params?.filters?.chosen?.$eq;
    if (chosenFilter !== undefined && chosenFilter !== null) {
      list = list.filter((item) => Boolean(item.attributes?.chosen) === Boolean(chosenFilter));
    }

    // 排序处理
    const sort = params.sort || params['sort[0]'];
    if (sort) {
      if (sort.includes('views:desc')) {
        list.sort((a, b) => (b.attributes.views || 0) - (a.attributes.views || 0));
      } else if (sort.includes('articleUpdatedAt:asc')) {
        list.sort((a, b) => new Date(a.attributes.articleUpdatedAt) - new Date(b.attributes.articleUpdatedAt));
      } else {
        // 默认 desc
        list.sort((a, b) => new Date(b.attributes.articleUpdatedAt) - new Date(a.attributes.articleUpdatedAt));
      }
    }

    // 上一篇 / 下一篇过滤处理
    const ltTime = params['filters[articleUpdatedAt][$lt]'];
    if (ltTime) {
      list = list.filter((item) => new Date(item.attributes.articleUpdatedAt) < new Date(ltTime));
    }
    const gtTime = params['filters[articleUpdatedAt][$gt]'];
    if (gtTime) {
      list = list.filter((item) => new Date(item.attributes.articleUpdatedAt) > new Date(gtTime));
    }

    const total = list.length;
    const start = Number(params?.pagination?.start ?? 0);
    const limit = Number(params?.pagination?.limit ?? total);

    const paginated = list.slice(start, start + limit);

    return {
      data: paginated,
      meta: {
        pagination: {
          total,
          start,
          limit,
          page: Math.floor(start / (limit || 1)) + 1,
          pageSize: limit,
          pageCount: Math.ceil(total / (limit || 1)),
        },
      },
    };
  }

  return { data: [] };
}

export async function findOne(model, id, params = {}) {
  if (model === 'articles') {
    const siteData = await getSiteData();
    const item = (siteData.articles || []).find((a) => String(a.id) === String(id));
    return { data: item || null };
  }

  if (model === 'users') {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      try {
        return { data: JSON.parse(storedUser) };
      } catch {}
    }
    return {
      data: {
        id,
        attributes: {
          username: '访客',
          avatar_url: '',
        },
      },
    };
  }

  return { data: null };
}

export async function update(model, id, data) {
  // 阅读量自增由边缘函数接管，未配置或本地调试时优雅降级
  if (model === 'articles' && data?.views !== undefined) {
    try {
      await axios.post(`/api/views/${id}`, data);
    } catch {
      // 本地无边缘函数时静默降级
    }
  }
  return { data: { id, attributes: data } };
}

export function count(model, params = {}) {
  return find(model, params).then((res) => ({ data: res?.meta?.pagination?.total || 0 }));
}

export function create(model, data) {
  return Promise.resolve({ data });
}

export function deleted(model, id) {
  return Promise.resolve({ data: { id } });
}

export function register(data) {
  return Promise.reject(new Error('请使用 GitHub 或 Gitee 快捷登录'));
}

export function login(data) {
  return Promise.reject(new Error('请使用 GitHub 或 Gitee 快捷登录'));
}
