import Link from 'next/link';
import type { TagInfo } from '../lib/tags';

interface TagCloudProps {
  tags: TagInfo[];
  limit?: number;
  showCount?: boolean;
  className?: string;
}

// 辅助函数：计算标签云的字体大小（基于文章数量）
function getTagFontSize(count: number, maxCount: number): string {
  const minSize = 0.85; // 最小字体大小 (rem)
  const maxSize = 1.6; // 最大字体大小 (rem)

  if (maxCount === 0) return `${minSize}rem`;

  const ratio = count / maxCount;
  const size = minSize + (maxSize - minSize) * Math.pow(ratio, 0.7); // 使用平方根让大小差异更平滑

  return `${size}rem`;
}

// 标签颜色类名（根据文章数量）
function getTagColorClass(count: number, maxCount: number): string {
  const ratio = count / maxCount;

  if (ratio >= 0.8) return 'tag-hot';
  if (ratio >= 0.5) return 'tag-popular';
  if (ratio >= 0.3) return 'tag-normal';
  return 'tag-cool';
}

export default function TagCloud({ tags, limit = 50, showCount = true, className = '' }: TagCloudProps) {
  const limitedTags = tags.slice(0, limit);
  const maxCount = limitedTags.length > 0 ? limitedTags[0].count : 1;

  if (limitedTags.length === 0) {
    return (
      <div className={`tag-cloud ${className}`}>
        <p className="no-tags">暂无标签</p>
      </div>
    );
  }

  return (
    <div className={`tag-cloud ${className}`}>
      <div className="tag-cloud-content">
        {limitedTags.map((tag) => {
          const fontSize = getTagFontSize(tag.count, maxCount);
          const colorClass = getTagColorClass(tag.count, maxCount);

          return (
            <Link
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className={`tag-item ${colorClass}`}
              style={{ fontSize }}
              title={`${tag.name} (${tag.count} 篇文章)`}
            >
              {tag.name}
              {showCount && (
                <span className="tag-item-count">{tag.count}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}