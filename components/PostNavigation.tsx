import Link from 'next/link';
import { PostMeta } from '../lib/posts';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PostNavigationProps {
  currentPost: PostMeta;
  allPosts: PostMeta[];
  className?: string;
}

export default function PostNavigation({
  currentPost,
  allPosts,
  className = ''
}: PostNavigationProps) {
  // 按日期排序所有文章（最新的在前）
  const sortedPosts = [...allPosts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 找到当前文章在排序后的索引
  const currentIndex = sortedPosts.findIndex(post => post.uuid === currentPost.uuid);

  // 获取上一篇和下一篇文章
  const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

  // 如果没有上一篇或下一篇，则不显示组件
  if (!prevPost && !nextPost) {
    return null;
  }

  return (
    <nav className={`post-navigation ${className}`}>
      <div className="post-navigation-container">
        {/* 上一篇文章 */}
        {prevPost && (
          <Link
            href={`/post/${prevPost.uuid}`}
            className="post-nav-link post-nav-prev"
          >
            <div className="post-nav-direction">
              <FaChevronLeft className="post-nav-icon" />
              <span className="post-nav-label">上一篇</span>
            </div>
            <div className="post-nav-content">
              <h4 className="post-nav-title">{prevPost.title}</h4>
              {prevPost.description && (
                <p className="post-nav-description">
                  {prevPost.description.length > 100
                    ? prevPost.description.substring(0, 100) + '...'
                    : prevPost.description
                  }
                </p>
              )}
              <time className="post-nav-date">
                {new Date(prevPost.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
            </div>
          </Link>
        )}

        {/* 占位空间，用于居中布局 */}
        <div className="post-nav-spacer"></div>

        {/* 下一篇文章 */}
        {nextPost && (
          <Link
            href={`/post/${nextPost.uuid}`}
            className="post-nav-link post-nav-next"
          >
            <div className="post-nav-content">
              <h4 className="post-nav-title">{nextPost.title}</h4>
              {nextPost.description && (
                <p className="post-nav-description">
                  {nextPost.description.length > 100
                    ? nextPost.description.substring(0, 100) + '...'
                    : nextPost.description
                  }
                </p>
              )}
              <time className="post-nav-date">
                {new Date(nextPost.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="post-nav-direction">
              <span className="post-nav-label">下一篇</span>
              <FaChevronRight className="post-nav-icon" />
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}