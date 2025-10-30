import Link from 'next/link';
import { PostMeta } from '../lib/posts';
import { RecommendationResult, getComprehensiveRecommendations } from '../lib/recommendations';
import { FaClock, FaFire, FaLink } from 'react-icons/fa';

interface RelatedPostsProps {
  currentPost: PostMeta;
  allPosts: PostMeta[];
  showLatest?: boolean;
  showPopular?: boolean;
  className?: string;
}

export default function RelatedPosts({
  currentPost,
  allPosts,
  showLatest = true,
  showPopular = true,
  className = ''
}: RelatedPostsProps) {
  const recommendations = getComprehensiveRecommendations(currentPost, allPosts, {
    relatedLimit: 3,
    latestLimit: showLatest ? 2 : 0,
    popularLimit: showPopular ? 2 : 0
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const PostCard = ({ post, reasons }: { post: PostMeta; reasons?: string[] }) => (
    <Link href={`/post/${post.uuid}`} className="related-post-card">
      <div className="related-post-header">
        <h4 className="related-post-title">{post.title}</h4>
        {post.tags && post.tags.length > 0 && (
          <div className="related-post-tags">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="related-post-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="related-post-meta">
        <time className="related-post-date">{formatDate(post.date)}</time>
        {post.description && (
          <p className="related-post-description">
            {post.description.length > 80
              ? post.description.substring(0, 80) + '...'
              : post.description
            }
          </p>
        )}
        {reasons && reasons.length > 0 && (
          <div className="related-reasons">
            {reasons.map((reason, index) => (
              <span key={index} className="related-reason">
                {reason}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );

  if (recommendations.related.length === 0 &&
      recommendations.latest.length === 0 &&
      recommendations.popular.length === 0) {
    return null;
  }

  return (
    <div className={`related-posts ${className}`}>
      <h3 className="related-posts-title">
        <FaLink className="related-posts-icon" />
        相关推荐
      </h3>

      {/* 相关文章 */}
      {recommendations.related.length > 0 && (
        <div className="related-section">
          <h4 className="related-section-title">相关文章</h4>
          <div className="related-posts-grid">
            {recommendations.related.map((rec, index) => (
              <PostCard
                key={`related-${rec.post.uuid}`}
                post={rec.post}
                reasons={rec.reasons}
              />
            ))}
          </div>
        </div>
      )}

      {/* 最新文章 */}
      {showLatest && recommendations.latest.length > 0 && (
        <div className="related-section">
          <h4 className="related-section-title">
            <FaClock className="section-icon" />
            最新文章
          </h4>
          <div className="related-posts-grid">
            {recommendations.latest.map((post) => (
              <PostCard
                key={`latest-${post.uuid}`}
                post={post}
              />
            ))}
          </div>
        </div>
      )}

      {/* 热门文章 */}
      {showPopular && recommendations.popular.length > 0 && (
        <div className="related-section">
          <h4 className="related-section-title">
            <FaFire className="section-icon" />
            热门文章
          </h4>
          <div className="related-posts-grid">
            {recommendations.popular.map((post) => (
              <PostCard
                key={`popular-${post.uuid}`}
                post={post}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}