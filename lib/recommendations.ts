import type { Post, PostMeta } from './posts';

// 推荐结果类型
export interface RecommendationResult {
  post: PostMeta;
  score: number;
  reasons: string[];
}

// 计算文章相似度
export function calculateSimilarity(post1: PostMeta, post2: PostMeta): number {
  let score = 0;

  // 标签相似度（权重最高）
  if (post1.tags && post2.tags) {
    const commonTags = post1.tags.filter(tag => post2.tags!.includes(tag));
    const totalTags = new Set([...post1.tags, ...post2.tags]).size;

    if (totalTags > 0) {
      score += (commonTags.length / totalTags) * 0.5; // 50%权重
    }
  }

  // 时间相似度（同一月或同年）
  const date1 = new Date(post1.date);
  const date2 = new Date(post2.date);
  const daysDiff = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff <= 30) {
    score += 0.2; // 同月文章
  } else if (date1.getFullYear() === date2.getFullYear()) {
    score += 0.1; // 同年文章
  }

  // 标题相似度（基于关键词）
  const title1Words = post1.title.toLowerCase().split(/\s+/);
  const title2Words = post2.title.toLowerCase().split(/\s+/);
  const commonTitleWords = title1Words.filter(word =>
    word.length > 2 && title2Words.includes(word)
  );

  if (commonTitleWords.length > 0) {
    score += (commonTitleWords.length / Math.max(title1Words.length, title2Words.length)) * 0.2;
  }

  // 描述相似度
  if (post1.description && post2.description) {
    const desc1Words = post1.description.toLowerCase().split(/\s+/);
    const desc2Words = post2.description.toLowerCase().split(/\s+/);
    const commonDescWords = desc1Words.filter(word =>
      word.length > 2 && desc2Words.includes(word)
    );

    if (commonDescWords.length > 0) {
      score += (commonDescWords.length / Math.max(desc1Words.length, desc2Words.length)) * 0.1;
    }
  }

  return Math.min(score, 1); // 限制在0-1之间
}

// 获取相关文章推荐
export function getRelatedPosts(
  currentPost: PostMeta,
  allPosts: PostMeta[],
  limit = 5
): RecommendationResult[] {
  // 排除当前文章
  const otherPosts = allPosts.filter(post => post.uuid !== currentPost.uuid);

  // 计算相似度并生成推荐结果
  const recommendations: RecommendationResult[] = otherPosts.map(post => {
    const similarity = calculateSimilarity(currentPost, post);
    const reasons: string[] = [];

    // 生成推荐理由
    if (currentPost.tags && post.tags) {
      const commonTags = currentPost.tags.filter(tag => post.tags!.includes(tag));
      if (commonTags.length > 0) {
        reasons.push(`共同标签: ${commonTags.join(', ')}`);
      }
    }

    const date1 = new Date(currentPost.date);
    const date2 = new Date(post.date);
    const daysDiff = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff <= 30) {
      reasons.push('发布时间相近');
    } else if (date1.getFullYear() === date2.getFullYear()) {
      reasons.push('同年发布');
    }

    if (similarity > 0.3 && reasons.length === 0) {
      reasons.push('内容相关');
    }

    return {
      post,
      score: similarity,
      reasons
    };
  });

  // 过滤掉相似度太低的文章
  const filteredRecommendations = recommendations.filter(rec => rec.score > 0.1);

  // 按相似度排序并限制数量
  return filteredRecommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// 获取最新文章推荐（基于时间）
export function getLatestPosts(
  currentPost: PostMeta,
  allPosts: PostMeta[],
  limit = 3
): PostMeta[] {
  return allPosts
    .filter(post => post.uuid !== currentPost.uuid)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, limit);
}

// 获取热门文章推荐（基于标签热度）
export function getPopularPosts(
  currentPost: PostMeta,
  allPosts: PostMeta[],
  limit = 3
): PostMeta[] {
  // 计算每篇文章的"热度"（基于标签热度）
  const tagCounts = new Map<string, number>();

  allPosts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
  });

  const postsWithPopularity = allPosts
    .filter(post => post.uuid !== currentPost.uuid)
    .map(post => {
      let popularity = 0;

      if (post.tags) {
        post.tags.forEach(tag => {
          popularity += tagCounts.get(tag) || 0;
        });
      }

      return { post, popularity };
    })
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map(item => item.post);

  return postsWithPopularity;
}

// 获取综合推荐（结合多种策略）
export function getComprehensiveRecommendations(
  currentPost: PostMeta,
  allPosts: PostMeta[],
  options: {
    relatedLimit?: number;
    latestLimit?: number;
    popularLimit?: number;
  } = {}
): {
  related: RecommendationResult[];
  latest: PostMeta[];
  popular: PostMeta[];
} {
  const {
    relatedLimit = 3,
    latestLimit = 2,
    popularLimit = 2
  } = options;

  return {
    related: getRelatedPosts(currentPost, allPosts, relatedLimit),
    latest: getLatestPosts(currentPost, allPosts, latestLimit),
    popular: getPopularPosts(currentPost, allPosts, popularLimit)
  };
}