import { Post, PostMeta } from './posts';

// 搜索结果类型
export interface SearchResult {
  post: PostMeta;
  score: number;
  matches: {
    title: boolean;
    content: boolean;
    tags: boolean;
    description: boolean;
  };
}

// 简单的搜索算法
export function searchPosts(query: string, posts: PostMeta[]): SearchResult[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  posts.forEach(post => {
    let score = 0;
    const matches = {
      title: false,
      content: false,
      tags: false,
      description: false
    };

    // 标题匹配（权重最高）
    if (post.title.toLowerCase().includes(searchTerm)) {
      score += 100;
      matches.title = true;
    }

    // 描述匹配
    if (post.description && post.description.toLowerCase().includes(searchTerm)) {
      score += 50;
      matches.description = true;
    }

    // 标签匹配
    if (post.tags) {
      post.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm)) {
          score += 30;
          matches.tags = true;
        }
      });
    }

    // 如果有任何匹配，添加到结果
    if (score > 0) {
      results.push({ post, score, matches });
    }
  });

  // 按分数排序
  return results.sort((a, b) => b.score - a.score);
}

// 获取搜索建议（自动补全）
export function getSearchSuggestions(query: string, posts: PostMeta[]): string[] {
  if (!query.trim() || query.length < 2) return [];

  const searchTerm = query.toLowerCase();
  const suggestions = new Set<string>();

  posts.forEach(post => {
    // 从标题中提取词汇
    const titleWords = post.title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.includes(searchTerm) && word !== searchTerm) {
        suggestions.add(word);
      }
    });

    // 从标签中提取
    if (post.tags) {
      post.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm) &&
            tag.toLowerCase() !== searchTerm) {
          suggestions.add(tag);
        }
      });
    }
  });

  return Array.from(suggestions).slice(0, 5); // 限制建议数量
}

// 高亮搜索词
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}