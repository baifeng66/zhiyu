import Head from "next/head";
import { GetStaticProps } from "next";
import { getAllPosts, PostMeta } from "../../lib/posts";
import { canonicalUrl } from "../../lib/meta";
import { siteConfig } from "../../lib/site.config";
import { getAllTags, TagInfo } from "../../lib/tags";
import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaTag } from "react-icons/fa";
import BackToTop from "../../components/BackToTop";
import DailyQuote from "../../components/DailyQuote";
import Link from "next/link";
import TagCloud from "../../components/TagCloud";

type Props = {
  tags: TagInfo[];
  posts: PostMeta[];
};

// 中文注释：标签页面，展示所有标签云
export default function TagsPage({ tags, posts }: Props) {
  const url = canonicalUrl("/tags");
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
        <title>标签 - {siteConfig.title}</title>
        <link rel="canonical" href={url} />
        <meta name="description" content={`${siteConfig.title}的所有标签，探索技术文章的分类标签云。`} />
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
            标签云
          </h1>
          <p className="page-description">
            共 {tags.length} 个标签，{posts.length} 篇文章
          </p>
        </div>

        <div className="tags-page-content">
          <TagCloud
            tags={tags}
            limit={100}
            showCount={true}
            className="tags-cloud-main"
          />
        </div>

        {/* 热门标签列表 */}
        {tags.length > 10 && (
          <section className="popular-tags-section">
            <h2>热门标签</h2>
            <div className="popular-tags-grid">
              {tags.slice(0, 10).map((tag) => (
                <Link
                  key={tag.name}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="popular-tag-card"
                >
                  <div className="popular-tag-header">
                    <span className="popular-tag-name">{tag.name}</span>
                    <span className="popular-tag-count">{tag.count}</span>
                  </div>
                  <div className="popular-tag-meta">
                    {tag.count} 篇文章
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = getAllPosts(false);
  const tags = getAllTags();

  return {
    props: {
      tags,
      posts
    }
  };
};