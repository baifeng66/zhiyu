import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { getAllPosts, groupPostsByYear, PostMeta } from "../../lib/posts";
import { canonicalUrl } from "../../lib/meta";
import { siteConfig } from "../../lib/site.config";
import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaChevronDown, FaChevronRight } from "react-icons/fa";
import BackToTop from "../../components/BackToTop";
import DailyQuote from "../../components/DailyQuote";

type Props = { groups: [string, PostMeta[]][] };

// 中文注释：归档页，按年份分组，支持折叠。
export default function ArchivesPage({ groups }: Props) {
  const url = canonicalUrl("/archives");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [collapsedYears, setCollapsedYears] = useState<Set<string>>(new Set());

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

  // 切换年份折叠状态
  const toggleYear = (year: string) => {
    setCollapsedYears(prev => {
      const newSet = new Set(prev);
      if (newSet.has(year)) {
        newSet.delete(year);
      } else {
        newSet.add(year);
      }
      return newSet;
    });
  };

  return (
    <div className="container">
      <Head>
        <title>归档 - {siteConfig.title}</title>
        <link rel="canonical" href={url} />
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
        <div className="archives-container">
          {groups.map(([year, items]) => (
            <div key={year} className="year-section">
              <div
                className="year-header"
                onClick={() => toggleYear(year)}
              >
                {collapsedYears.has(year) ? <FaChevronRight /> : <FaChevronDown />}
                <h2>{year}年</h2>
                <span className="year-count">{items.length}篇</span>
              </div>

              {!collapsedYears.has(year) && (
                <div className="post-grid">
                  {items.map((p) => (
                    <article key={p.uuid} className="post-card">
                      <div className="post-card-header">
                        <h2 className="post-card-title">
                          <Link href={`/post/${p.uuid}`}>{p.title}</Link>
                        </h2>
                      </div>

                      <div className="post-card-meta">
                        <time className="post-card-date">
                          {new Date(p.date).toLocaleDateString('zh-CN', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      </div>

                      {p.tags && p.tags.length > 0 && (
                        <div className="post-card-tags">
                          {p.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="post-card-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
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
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = getAllPosts(false).map(({ content, ...meta }) => meta);
  const grouped = groupPostsByYear(posts);
  const groups = Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .map((y) => [y, grouped[y]] as [string, PostMeta[]]);
  return { props: { groups } };
};

