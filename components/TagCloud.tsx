import Link from 'next/link';
import { getAllTags, getTagFontSize, getTagColorClass } from '../lib/tags';

interface TagCloudProps {
  limit?: number;
  showCount?: boolean;
  className?: string;
}

export default function TagCloud({ limit = 50, showCount = true, className = '' }: TagCloudProps) {
  const tags = getAllTags().slice(0, limit);
  const maxCount = tags.length > 0 ? tags[0].count : 1;

  if (tags.length === 0) {
    return (
      <div className={`tag-cloud ${className}`}>
        <p className="no-tags">暂无标签</p>
      </div>
    );
  }

  return (
    <div className={`tag-cloud ${className}`}>
      <div className="tag-cloud-title">
        <h3>标签云</h3>
        <span className="tag-count">共 {tags.length} 个标签</span>
      </div>
      <div className="tag-cloud-content">
        {tags.map((tag) => {
          const fontSize = getTagFontSize(tag.count, maxCount);
          const colorClass = getTagColorClass(tag.count, maxCount);

          return (
            <Link
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className={`tag-item ${colorClass}`}
              style={{ fontSize }}
            >
              {tag.name}
              {showCount && (
                <span className="tag-item-count">({tag.count})</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}