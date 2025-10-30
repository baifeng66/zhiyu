import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { getAllPosts, PostMeta } from "../../lib/posts";
import { canonicalUrl } from "../../lib/meta";
import { siteConfig } from "../../lib/site.config";
import { getPostsByTag, getAllTags, TagInfo } from "../../lib/tags";
import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaTag, FaCalendar, FaClock } from "react-icons/fa";
import BackToTop from "../../components/BackToTop";
import DailyQuote from "../../components/DailyQuote";
import Link from "next/link";

type Props = {
  tag: string;
  posts: PostMeta[];
  tagInfo: TagInfo | null;
};

// 中文注释：标签详情页，展示特定标签的所有文章
export default function TagPage({ tag, posts, tagInfo }: Props) {
  const url = canonicalUrl(`/tags/${encodeURIComponent(tag)}`);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="container">
      <Head>
        <title>{tag} - {siteConfig.title}</title>
        <link rel="canonical" href={url} />
        <meta name="description" content={`${siteConfig.title}中关于"${tag}"标签的所有文章，共${posts.length}篇。`} />
      </Head>
      <header className="site-header">
        <div className="site-title"><Link href="/">{siteConfig.title}</Link></div>
        <div className="site-header-controls">
          <nav className="site-nav">
            <Link href="/">首页</Link>
            <Link href="/archives">归档</Link>
            <Link href="/tags">标签</Link>
            <Link href="/about">关于</Link>
          </nav>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="切换主题"
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </header>
      <main>
        <div className="page-header">
          <h1 className="page-title">
            <FaTag className="page-icon" />
            {tag}
          </h1>
          <p className="page-description">
            共 {posts.length} 篇相关文章
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <p>暂无相关文章</p>
            <Link href="/" className="back-link">
              返回首页
            </Link>
          </div>
        ) : (
          <div className="tag-posts-content">
            <div className="post-grid">
              {posts.map((post) => (
                <article key={post.uuid} className="post-card">
                  <div className="post-card-header">
                    <h2 className="post-card-title">
                      <Link href={`/post/${post.uuid}`}>{post.title}</Link>
                    </h2>
                  </div>

                  {post.description && (
                    <div className="post-card-content">
                      <p className="post-card-excerpt">
                        {post.description}
                      </p>
                    </div>
                  )}

                  <div className="post-card-meta">
                    <time className="post-card-date">
                      <FaCalendar className="meta-icon" />
                      {new Date(post.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="post-card-tags">
                      {post.tags.slice(0, 3).map((tagItem, index) => (
                        <span key={index} className="post-card-tag">
                          {tagItem}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="post-card-footer">
                    <Link href={`/post/${post.uuid}`} className="read-more-btn">
                      阅读更多 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 返回标签云 */}
        <div className="back-to-tags">
          <Link href="/tags" className="back-link">
            ← 返回标签云
          </Link>
        </div>
      </main>
      <footer className="site-footer">
        <div className="site-footer-links">
          <a href="/feed.xml">RSS 订阅</a>
          <DailyQuote />
          <a href="/sitemap.xml">网站地图</a>
        </div>
        <div className="site-footer-copyright">
          <span>© {new Date().getFullYear()} {siteConfig.author}</span>
          <span className="site-footer-heart"> ❤️ </span>
          <span>用心记录，用爱发电</span>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = getAllTags();
  const paths = tags.map((tag) => ({
    params: { tag: tag.name }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const tag = String(params?.tag);
  const posts = getPostsByTag(tag);
  const allTags = getAllTags();
  const tagInfo = allTags.find(t => t.name === tag) || null;

  return {
    props: {
      tag,
      posts,
      tagInfo
    }
  };
};