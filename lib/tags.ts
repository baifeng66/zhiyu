import type { PostMeta } from './posts';
import { getAllPosts } from './posts';

// 标签统计信息
export interface TagInfo {
  name: string;
  count: number;
  posts: PostMeta[];
}

// 获取所有标签及其统计信息
export function getAllTags(): TagInfo[] {
  const posts = getAllPosts(false);
  const tagMap = new Map<string, PostMeta[]>();

  // 收集每个标签对应的文章
  posts.forEach(post => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(post);
      });
    }
  });

  // 转换为标签信息数组
  const tags: TagInfo[] = Array.from(tagMap.entries()).map(([name, posts]) => ({
    name,
    count: posts.length,
    posts: posts.sort((a, b) => +new Date(b.date) - +new Date(a.date))
  }));

  // 按文章数量排序
  return tags.sort((a, b) => b.count - a.count);
}

// 获取指定标签的文章
export function getPostsByTag(tagName: string): PostMeta[] {
  const posts = getAllPosts(false);
  return posts.filter(post =>
    post.tags && post.tags.includes(tagName)
  ).sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

// 获取相关标签（基于共同文章）
export function getRelatedTags(tagName: string, limit = 10): TagInfo[] {
  const allTags = getAllTags();
  const targetTagPosts = getPostsByTag(tagName);

  // 计算其他标签与目标标签的关联度
  const relatedTags = allTags
    .filter(tag => tag.name !== tagName)
    .map(tag => {
      // 计算共同文章数
      const commonPosts = tag.posts.filter(post =>
        targetTagPosts.some(targetPost => targetPost.uuid === post.uuid)
      );

      return {
        ...tag,
        relevanceScore: commonPosts.length
      };
    })
    .filter(tag => tag.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return relatedTags;
}

// 热门标签（按文章数量）
export function getPopularTags(limit = 20): TagInfo[] {
  return getAllTags().slice(0, limit);
}

// 计算标签云的字体大小（基于文章数量）
export function getTagFontSize(count: number, maxCount: number): string {
  const minSize = 0.8; // 最小字体大小 (rem)
  const maxSize = 1.8; // 最大字体大小 (rem)

  if (maxCount === 0) return `${minSize}rem`;

  const ratio = count / maxCount;
  const size = minSize + (maxSize - minSize) * ratio;

  return `${size}rem`;
}

// 标签颜色类名（根据文章数量）
export function getTagColorClass(count: number, maxCount: number): string {
  const ratio = count / maxCount;

  if (ratio >= 0.8) return 'tag-hot';
  if (ratio >= 0.5) return 'tag-popular';
  if (ratio >= 0.3) return 'tag-normal';
  return 'tag-cool';
}