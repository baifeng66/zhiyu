import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { getAllPosts, getPostSlugs, readPostBySlug, Post } from "../../lib/posts";
import { articleJsonLd, canonicalUrl } from "../../lib/meta";
import { markdownToHtml } from "../../lib/markdown";
import { siteConfig } from "../../lib/site.config";
import { useEffect, useState } from "react";
import * as cheerio from "cheerio";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import BackToTop from "../../components/BackToTop";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

type Props = { post: Post; html: string };

// 中文注释：文章详情页，构建期将 Markdown 转为 HTML，添加目录和返回顶部功能。
export default function PostPage({ post, html }: Props) {
  const url = canonicalUrl(`/posts/${post.slug}`);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
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

  // 生成目录
  useEffect(() => {
    const $ = cheerio.load(html);
    const tocItems: TocItem[] = [];

    $('h1, h2, h3, h4, h5, h6').each((index, element) => {
      const level = parseInt((element as any).tagName.substring(1));
      const text = $(element).text();
      const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-');

      $(element).attr('id', id);
      tocItems.push({ id, text, level });
    });

    setToc(tocItems);

    // 更新HTML内容
    document.querySelector('.post-content')!.innerHTML = $.html();
  }, [html]);

  // 跳转到目录项
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // 头部高度偏移
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="container">
      <Head>
        <title>{post.title} - {siteConfig.title}</title>
        <meta name="description" content={post.description || siteConfig.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description || siteConfig.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              articleJsonLd({
                title: post.title,
                description: post.description || undefined,
                url,
                datePublished: post.date,
                author: siteConfig.author,
              })
            ),
          }}
        />
      </Head>

      <header className="site-header">
        <div className="site-title"><a href="/">{siteConfig.title}</a></div>
        <div className="site-header-controls">
          <nav className="site-nav">
            <a href="/">首页</a>
            <a href="/archives">归档</a>
            <a href="/about">关于</a>
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

      <div className="post-wrapper">
        {/* 目录 */}
        {toc.length > 0 && (
          <div className={`post-toc ${isTocCollapsed ? 'collapsed' : ''}`}>
            <div className="toc-header">
              <h3>目录</h3>
              <button
                className="toc-toggle"
                onClick={() => setIsTocCollapsed(!isTocCollapsed)}
                aria-label={isTocCollapsed ? "展开目录" : "收起目录"}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 4l4 4-4 4-4-4z"/>
                </svg>
              </button>
            </div>
            {!isTocCollapsed && (
              <ul>
                {toc.map((item, index) => (
                  <li
                    key={index}
                    className={`toc-level-${item.level}`}
                    onClick={() => scrollToHeading(item.id)}
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 文章内容 */}
        <article className="post">
          <h1>{post.title}</h1>
          <div className="post-info">
            <time dateTime={post.date}>{new Date(post.date).toISOString().slice(0, 10)}</time>
          </div>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </div>

      <footer className="site-footer">
        <a href="/feed.xml">RSS</a>
        <a href="/sitemap.xml">Sitemap</a>
        <span>© {new Date().getFullYear()} {siteConfig.author}</span>
      </footer>
      <BackToTop />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getPostSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.slug);
  const post = readPostBySlug(slug);
  if (post.draft) {
    // 中文注释：生产环境剔除草稿。
    return { notFound: true } as const;
  }
  const html = await markdownToHtml(post.content);
  return { props: { post, html } };
};

