import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import matter from 'gray-matter';

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'content');
const postsDir = path.join(contentDir, 'posts');
const publicDir = path.join(rootDir, 'public');
const dataOutputDir = path.join(publicDir, 'data');

// 1. 清理旧的碎片数据，创建全新的 public/data 目录
if (fs.existsSync(dataOutputDir)) {
  fs.rmSync(dataOutputDir, { recursive: true, force: true });
}
fs.mkdirSync(dataOutputDir, { recursive: true });

function getGitTime(filePath) {
  const normPath = filePath.split(path.sep).join('/');
  let firstCommitTime = null;
  let latestCommitTime = null;

  try {
    const stdout = execSync(`git log --follow --format=%aI -- "${normPath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    if (stdout) {
      const lines = stdout.split('\n').filter(Boolean);
      if (lines.length > 0) {
        latestCommitTime = lines[0].trim();
        firstCommitTime = lines[lines.length - 1].trim();
      }
    }
  } catch {}

  try {
    const stats = fs.statSync(filePath);
    const fsBirth = stats.birthtime ? stats.birthtime.toISOString() : stats.mtime.toISOString();
    const fsMtime = stats.mtime ? stats.mtime.toISOString() : new Date().toISOString();

    return {
      createdAt: firstCommitTime || fsBirth,
      updatedAt: latestCommitTime || fsMtime,
    };
  } catch {
    const now = new Date().toISOString();
    return { createdAt: now, updatedAt: now };
  }
}

function extractImagesFromMarkdown(markdownText) {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  let match;
  const images = [];
  while ((match = imageRegex.exec(markdownText)) !== null) {
    images.push(match[1]);
  }
  return images;
}

/**
 * 健壮的跨平台安全写盘函数
 * 1. 内容一致时跳过写盘，防止触发文件系统冲突及热更新死循环
 * 2. 针对 Windows 下 IDE / 内存映射 / 杀软等句柄占用进行带退避的重试
 * 3. 静态辅助文件降级容错，确保主流程不崩溃
 */
function safeWriteFileSync(filePath, content, retries = 5, delayMs = 60) {
  try {
    if (fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath, 'utf-8');
      if (existing === content) {
        return;
      }
    }
  } catch {}

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (fs.existsSync(filePath)) {
        try {
          fs.chmodSync(filePath, 0o666);
        } catch {}
      }
      fs.writeFileSync(filePath, content, 'utf-8');
      return;
    } catch (err) {
      if (attempt === retries) {
        if (fs.existsSync(filePath)) {
          console.warn(`⚠️ [safeWrite] 无法覆盖更新 ${path.basename(filePath)} (${err.message})，保留现有文件。`);
          return;
        }
        throw err;
      }
      const start = Date.now();
      const waitTime = delayMs * (attempt + 1);
      while (Date.now() - start < waitTime) {}
    }
  }
}

function stripMarkdown(content) {
  return content
    .replace(/^#+\s+/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
    .replace(/[*_~`]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

console.log('🚀 开始生成全站单一聚合数据文件 (site-data.json)...');

// 2. 读取基础配置
const configFile = path.join(contentDir, 'config.json');
const categoriesFile = path.join(contentDir, 'categories.json');
const friendsFile = path.join(contentDir, 'friends.json');

const siteConfig = fs.existsSync(configFile)
  ? JSON.parse(fs.readFileSync(configFile, 'utf-8'))
  : { title: "Kite's Blog" };

const rawCategories = fs.existsSync(categoriesFile)
  ? JSON.parse(fs.readFileSync(categoriesFile, 'utf-8'))
  : [];

const rawFriends = fs.existsSync(friendsFile)
  ? JSON.parse(fs.readFileSync(friendsFile, 'utf-8'))
  : [];

// 3. 扫描并解析所有 Markdown 文章
const postFiles = fs.existsSync(postsDir)
  ? fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'))
  : [];

console.log(`📝 发现 ${postFiles.length} 篇 Markdown 文章`);

const articles = [];
const searchIndex = [];
const tagsMap = new Map();
let nextTagId = 1;

for (let index = 0; index < postFiles.length; index++) {
  const filename = postFiles[index];
  const fullPath = path.join(postsDir, filename);
  const relativePath = `content/posts/${filename}`;
  const rawContent = fs.readFileSync(fullPath, 'utf-8');

  const { data: frontmatter, content: markdownBody } = matter(rawContent);
  const gitTimes = getGitTime(fullPath);

  const id = frontmatter.id !== undefined ? frontmatter.id : index + 1;
  const title = frontmatter.title || filename.replace(/\.md$/, '');
  const description = frontmatter.description || stripMarkdown(markdownBody).slice(0, 150);
  const createdAt = frontmatter.createdAt || frontmatter.date || gitTimes.createdAt;
  const updatedAt = frontmatter.updatedAt || gitTimes.updatedAt;
  const chosen = Boolean(frontmatter.chosen);
  const views = Number(frontmatter.views || 0);
  const cover = frontmatter.cover || null;

  let matchedCategory = rawCategories.find(
    (c) => c.name === frontmatter.category || c.attributes?.name === frontmatter.category || c.id === frontmatter.category
  );
  if (!matchedCategory && rawCategories.length > 0) {
    matchedCategory = rawCategories[0];
  }

  const categoryRelation = matchedCategory
    ? {
        data: {
          id: matchedCategory.id,
          attributes: matchedCategory.attributes || matchedCategory,
        },
      }
    : null;

  const rawTags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags
    : typeof frontmatter.tags === 'string'
      ? frontmatter.tags.split(',').map((t) => t.trim())
      : [];

  const tagRelations = [];
  for (const tagName of rawTags) {
    if (!tagName) continue;
    if (!tagsMap.has(tagName)) {
      tagsMap.set(tagName, {
        id: nextTagId++,
        name: tagName,
        count: 0,
      });
    }
    const tagInfo = tagsMap.get(tagName);
    tagInfo.count++;
    tagRelations.push({
      id: tagInfo.id,
      attributes: {
        name: tagInfo.name,
      },
    });
  }

  const authorRelation = {
    data: {
      id: 1,
      attributes: {
        username: 'lizhixu',
        views: 0,
      },
    },
  };

  const extractedImages = extractImagesFromMarkdown(markdownBody);
  const imgList = cover ? [cover, ...extractedImages] : extractedImages;

  const articleItem = {
    id,
    attributes: {
      title,
      description,
      content: markdownBody,
      articleUpdatedAt: updatedAt,
      createdAt,
      updatedAt,
      views,
      chosen,
      cover,
      img: imgList,
      filePath: relativePath,
      category: categoryRelation,
      tags: { data: tagRelations },
      author: authorRelation,
    },
  };

  articles.push(articleItem);

  searchIndex.push({
    id,
    title,
    description,
    category: matchedCategory ? (matchedCategory.attributes?.name || matchedCategory.name) : '',
    tags: rawTags,
    summary: stripMarkdown(markdownBody).slice(0, 300),
  });
}

// 4. 按更新时间倒序排序并注入上一篇/下一篇
articles.sort((a, b) => new Date(b.attributes.articleUpdatedAt) - new Date(a.attributes.articleUpdatedAt));

for (let i = 0; i < articles.length; i++) {
  const next = i > 0 ? { id: articles[i - 1].id, attributes: { title: articles[i - 1].attributes.title } } : null;
  const previous = i < articles.length - 1 ? { id: articles[i + 1].id, attributes: { title: articles[i + 1].attributes.title } } : null;
  articles[i].attributes.previous = previous;
  articles[i].attributes.next = next;
}

// 5. 组合全站唯一单一数据大对象
const singleSiteData = {
  config: {
    data: {
      attributes: siteConfig,
    },
  },
  categories: {
    data: rawCategories,
  },
  friends: {
    data: rawFriends,
  },
  tags: {
    data: Array.from(tagsMap.values()).map((tag) => ({
      id: tag.id,
      attributes: {
        name: tag.name,
        count: tag.count,
      },
    })),
  },
  articles: articles,
  search: searchIndex,
};

const siteDataPath = path.join(dataOutputDir, 'site-data.json');
safeWriteFileSync(siteDataPath, JSON.stringify(singleSiteData));
const fileStats = fs.statSync(siteDataPath);
console.log(`📦 单一数据文件生成完成：public/data/site-data.json (${(fileStats.size / 1024).toFixed(1)} KB)`);

// 6. 自动生成全站 sitemap.xml
const domain = siteConfig.site_url || 'https://lizhixu.cn';
const sitemapUrls = [
  `<url><loc>${domain}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
  `<url><loc>${domain}/tags</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
  `<url><loc>${domain}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
];

for (const cat of rawCategories) {
  sitemapUrls.push(
    `<url><loc>${domain}/special/${cat.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
  );
}

for (const art of articles) {
  const lastmod = new Date(art.attributes.updatedAt || art.attributes.articleUpdatedAt).toISOString();
  sitemapUrls.push(
    `<url><loc>${domain}/article_detail/${art.id}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`
  );
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

safeWriteFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);

// 7. 自动生成 robots.txt
const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${domain}/sitemap.xml
`;
safeWriteFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);

console.log('✅ 全站单一数据、Sitemap 与 Robots 重新构建完毕！');
