// 中文注释：构建后生成 feed.xml 与 sitemap.xml 到 public/。
// 设计目标：无运行时依赖；仅基于文件系统读 Markdown frontmatter。
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Feed } from "feed";

const root = process.cwd();
const siteUrl = process.env.SITE_URL || "http://localhost:3000";
const contentDir = path.join(root, "content", "posts");
const publicDir = path.join(root, "public");

/** 读取所有文章元数据（仅 .md/.mdx） */
function readAllPosts() {
  if (!fs.existsSync(contentDir)) return [];
  const files = fs
    .readdirSync(contentDir)
    .filter((f) => /\.(md|mdx)$/i.test(f));
  const posts = files.map((f) => {
    const slug = f.replace(/\.(md|mdx)$/i, "");
    const raw = fs.readFileSync(path.join(contentDir, f), "utf8");
    const { data } = matter(raw);
    return {
      slug,
      title: String(data.title || slug),
      date: new Date(data.date || Date.now()).toISOString(),
      description: data.description ? String(data.description) : undefined,
      draft: Boolean(data.draft || false),
    };
  });
  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function buildFeed(posts) {
  const feed = new Feed({
    title: "枫知屿",
    description: "在数字世界里，寻找代码与诗意的交汇点",
    id: siteUrl,
    link: siteUrl,
    language: "zh-CN",
    favicon: `${siteUrl}/favicon.ico`,
    feedLinks: {
      rss: `${siteUrl}/feed.xml`,
    },
  });

  posts.forEach((p) => {
    feed.addItem({
      id: `${siteUrl}/posts/${p.slug}`,
      link: `${siteUrl}/posts/${p.slug}`,
      title: p.title,
      date: new Date(p.date),
      description: p.description,
    });
  });

  return feed.rss2();
}

function buildSitemap(posts) {
  const urls = ["/", "/archives", "/about", ...posts.map((p) => `/posts/${p.slug}`)];
  const now = new Date().toISOString();
  const items = urls
    .map((u) => `  <url>\n    <loc>${siteUrl}${u}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

function main() {
  ensureDir(publicDir);
  const posts = readAllPosts();
  const rss = buildFeed(posts);
  const sitemap = buildSitemap(posts);
  fs.writeFileSync(path.join(publicDir, "feed.xml"), rss);
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
  console.log(`生成完成：feed.xml 与 sitemap.xml（共 ${posts.length} 篇文章）`);
}

main();

