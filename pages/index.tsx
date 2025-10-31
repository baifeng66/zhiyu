import Link from "next/link";
import Head from "next/head";
import { GetStaticProps } from "next";
import type { PostMeta } from "../lib/posts";
import { canonicalUrl, websiteJsonLd } from "../lib/meta";
import { siteConfig } from "../lib/site.config";
import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaSearch, FaTimes, FaMagic } from "react-icons/fa";
import { format } from "date-fns";
import BackToTop from "../components/BackToTop";
import SearchBar from "../components/SearchBar";
import DailyQuote from "../components/DailyQuote";

type Props = {
  posts: PostMeta[];
  searchPosts: PostMeta[];
};

// 中文注释：首页列表，极简呈现"标题 + 日期"。
export default function Home({ posts, searchPosts }: Props) {
  const url = canonicalUrl("/");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [bgOn, setBgOn] = useState(false);

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // 初始化背景特效模式
    setBgOn(localStorage.getItem('bgEffectEnabled') === 'true');
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // 背景特效开/关（开启后混合随机掉落三种粒子）
  const toggleBg = () => {
    const enabled = !(localStorage.getItem('bgEffectEnabled') === 'true');
    localStorage.setItem('bgEffectEnabled', String(enabled));
    setBgOn(enabled);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('bg-effect-changed'));
  };

  return (
    <div className="container">
      <Head>
        <link rel="canonical" href={url} />
        <meta property="og:title" content={siteConfig.title} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <script
          type="application/ld+json"
          // 中文注释：结构化数据，帮助搜索引擎理解站点。
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
      </Head>
      <header className="site-header">
        <div className="site-title">
          <img src="/favicon.svg" alt="网站图标" className="site-logo" />
          <Link href="/">{siteConfig.title}</Link>
        </div>
        <div className="site-header-controls">
          <nav className="site-nav">
            <Link href="/">首页</Link>
            <Link href="/archives">归档</Link>
            <Link href="/about">关于</Link>
            <button
              className="search-trigger"
              onClick={() => setIsSearchOpen(true)}
              aria-label="打开搜索"
            >
              <FaSearch />
            </button>
          </nav>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="切换主题"
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          <button
            className="bg-toggle"
            onClick={toggleBg}
            aria-label="切换背景特效"
            title={bgOn ? '关闭背景特效' : '开启背景特效（低频柔和）'}
          >
            <FaMagic />
          </button>
        </div>
      </header>
      <main>
        <div className="post-grid">
          {posts.map((p) => (
            <article key={p.uuid} className="post-card">
              <div className="post-card-header">
                <h2 className="post-card-title">
                  <Link href={`/post/${p.uuid}`}>{p.title}</Link>
                </h2>
              </div>

              <div className="post-card-content">
                {p.description ? (
                  <p className="post-card-excerpt">{p.description}</p>
                ) : (
                  <p className="post-card-excerpt">点击查看完整内容...</p>
                )}
              </div>

              {/* 紧凑信息栏：日期 / 标签 / 阅读更多 一行展示 */}
              <div className="post-card-meta-row">
                <div className="post-card-meta-left">
                  <time className="post-card-date">
                    {format(new Date(p.date), "yyyy年 MM月dd日")}
                  </time>
                  {p.tags && p.tags.length > 0 && (
                    <div className="post-card-tags-inline">
                      {p.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="post-card-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="post-card-meta-right">
                  <Link href={`/post/${p.uuid}`} className="read-more-btn">
                    阅读更多 →
                  </Link>
                </div>
              </div>
            </article>
          ))}
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

      {/* 悬浮搜索框 */}
      {isSearchOpen && (
        <div className="search-overlay" onClick={() => setIsSearchOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <h3>搜索文章</h3>
              <button
                className="search-modal-close"
                onClick={() => setIsSearchOpen(false)}
                aria-label="关闭搜索"
              >
                <FaTimes />
              </button>
            </div>
            <SearchBar
              placeholder="搜索技术笔记..."
              posts={searchPosts}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { getAllPosts } = await import("../lib/posts");
  const allPosts = getAllPosts(false);
  const posts = allPosts.map(({ content, ...meta }) => meta);
  const searchPosts = allPosts.map(({ content, ...meta }) => meta); // 用于搜索的数据
  return { props: { posts, searchPosts } };
};
