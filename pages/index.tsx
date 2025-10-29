import Link from "next/link";
import Head from "next/head";
import { GetStaticProps } from "next";
import { getAllPosts, PostMeta } from "../lib/posts";
import { canonicalUrl, websiteJsonLd } from "../lib/meta";
import { siteConfig } from "../lib/site.config";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import BackToTop from "../components/BackToTop";

type Props = {
  posts: PostMeta[];
};

// 中文注释：首页列表，极简呈现"标题 + 日期"。
export default function Home({ posts }: Props) {
  const url = canonicalUrl("/");
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
        <div className="site-title"><Link href="/">{siteConfig.title}</Link></div>
        <div className="site-header-controls">
          <nav className="site-nav">
            <Link href="/">首页</Link>
            <Link href="/archives">归档</Link>
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
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.uuid}>
              <Link className="post-title" href={`/post/${p.uuid}`}>{p.title}</Link>
              <span className="post-date">{new Date(p.date).toISOString().slice(0, 10)}</span>
            </li>
          ))}
        </ul>
      </main>
      <footer className="site-footer">
        <a href="/feed.xml">RSS</a>
        <a href="/sitemap.xml">Sitemap</a>
        <span>© {new Date().getFullYear()} {siteConfig.author}</span>
      </footer>
      <BackToTop />
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = getAllPosts(false).map(({ content, ...meta }) => meta);
  return { props: { posts } };
};

