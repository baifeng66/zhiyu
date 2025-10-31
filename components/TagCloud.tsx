import Link from 'next/link';
import type { TagInfo } from '../lib/tags';

interface TagCloudProps {
  tags: TagInfo[];
  limit?: number;
  showCount?: boolean;
  className?: string;
  compact?: boolean; // 紧凑模式：更小字号与间距
}

// 辅助函数：计算标签云的字体大小（基于文章数量）
function getTagFontSize(count: number, maxCount: number, opts?: { compact?: boolean }): string {
  const compact = Boolean(opts?.compact);
  const minSize = compact ? 0.75 : 0.85; // 更小的基准字号
  const maxSize = compact ? 1.2 : 1.6;   // 降低最大字号

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

// 生成稳定颜色：基于标签名哈希映射到固定颜色类
function getCompactColorClass(name: string, colorCount = 8): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0; // 转32位整数
  }
  const idx = Math.abs(hash) % colorCount; // 0..colorCount-1
  return `tag-compact-c${idx + 1}`;
}

export default function TagCloud({ tags, limit = 50, showCount = true, className = '', compact = false }: TagCloudProps) {
  const limitedTags = tags.slice(0, limit);
  const maxCount = limitedTags.length > 0 ? Math.max(...limitedTags.map(t => t.count)) : 1;

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
          const fontSize = getTagFontSize(tag.count, maxCount, { compact });
          const colorClass = compact ? getCompactColorClass(tag.name) : getTagColorClass(tag.count, maxCount);

          return (
            <Link
              key={tag.name}
              href={compact && tag.name.toLowerCase() === 'show all' ? '/archives' : `/archives?tag=${encodeURIComponent(tag.name)}`}
              className={`tag-item ${compact ? 'tag-compact' : ''} ${colorClass}`}
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
