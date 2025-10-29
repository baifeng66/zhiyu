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

export function readPostBySlug(slug: string): Post {
  const fullPathMd = path.join(postsDir, `${slug}.md`);
  const fullPathMdx = path.join(postsDir, `${slug}.mdx`);
  const realPath = fs.existsSync(fullPathMd) ? fullPathMd : fullPathMdx;
  const raw = fs.readFileSync(realPath, "utf-8");
  const { data, content } = matter(raw);
  const meta: PostMeta = {
    slug,
    uuid: data.uuid ? String(data.uuid) : generateShortUUID(),
    title: String(data.title || slug),
    date: new Date(data.date || Date.now()).toISOString(),
    description: data.description ? String(data.description) : null,
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

