import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { generateShortUUID } from "./uuid";

// 中文注释：文章读取与元数据整理工具。

export type PostMeta = {
  slug: string;
  uuid: string;
  title: string;
  date: string; // ISO 字符串
  description: string | null;
  tags?: string[];
  draft?: boolean;
};

export type Post = PostMeta & { content: string };

const postsDir = path.join(process.cwd(), "content", "posts");

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(md|mdx)$/i, ""));
}

// 智能生成摘要
function generateExcerpt(content: string, maxLength: number = 120): string {
  // 移除Markdown语法
  const cleanContent = content
    .replace(/^#+\s+/gm, '') // 移除标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体
    .replace(/`(.*?)`/g, '$1') // 移除行内代码
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/^\s*[-*+]\s+/gm, '') // 移除列表项
    .replace(/^\s*\d+\.\s+/gm, '') // 移除有序列表
    .replace(/^\s*>\s+/gm, '') // 移除引用
    .replace(/\n+/g, ' ') // 换行转为空格
    .trim();

  // 如果内容本身就很短，直接返回
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // 尝试在句号、感叹号或问号处截断
  const punctuation = /[。！？.!?]/;
  let bestCut = maxLength;

  for (let i = maxLength; i > maxLength * 0.6; i--) {
    if (punctuation.test(cleanContent[i])) {
      bestCut = i + 1;
      break;
    }
  }

  const excerpt = cleanContent.substring(0, bestCut);
  return excerpt + '...';
}

export function readPostBySlug(slug: string): Post {
  const fullPathMd = path.join(postsDir, `${slug}.md`);
  const fullPathMdx = path.join(postsDir, `${slug}.mdx`);
  const realPath = fs.existsSync(fullPathMd) ? fullPathMd : fullPathMdx;
  const raw = fs.readFileSync(realPath, "utf-8");
  const { data, content } = matter(raw);

  // 智能处理description
  let description: string | null = null;
  if (data.description) {
    description = String(data.description);
  } else if (content.trim()) {
    // 自动生成摘要，限制长度以便在一行显示
    description = generateExcerpt(content, 60);
  }

  // 生成稳定的UUID：优先使用文件中的UUID，否则基于内容和slug生成
  const uuid = data.uuid
    ? String(data.uuid)
    : generateShortUUID(`${slug}-${content}-${data.title || slug}`);

  const meta: PostMeta = {
    slug,
    uuid,
    title: String(data.title || slug),
    date: new Date(data.date || Date.now()).toISOString(),
    description,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    draft: Boolean(data.draft || false),
  };
  return { ...meta, content };
}

export function getAllPosts(includeDraft = false): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs.map(readPostBySlug);
  const filtered = includeDraft
    ? posts
    : posts.filter((p) => !p.draft);
  return filtered.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function groupPostsByYear(posts: PostMeta[]): Record<string, PostMeta[]> {
  const map: Record<string, PostMeta[]> = {};
  posts.forEach((p) => {
    const y = new Date(p.date).getFullYear().toString();
    (map[y] ||= []).push(p);
  });
  Object.keys(map).forEach((y) => {
    map[y].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  });
  return map;
}

// 通过UUID获取文章
export function getPostByUUID(uuid: string): Post | null {
  const posts = getAllPosts();
  return posts.find(p => p.uuid === uuid) || null;
}

// 获取所有文章的UUID列表
export function getPostUUIDs(): string[] {
  const posts = getAllPosts();
  return posts.map(p => p.uuid);
}

