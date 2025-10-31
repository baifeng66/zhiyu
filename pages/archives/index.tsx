import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import type { PostMeta } from "../../lib/posts";
import { canonicalUrl } from "../../lib/meta";
import { siteConfig } from "../../lib/site.config";
import { useEffect, useMemo, useState } from "react";
import { FaMoon, FaSun, FaMagic } from "react-icons/fa";
import BackToTop from "../../components/BackToTop";
import DailyQuote from "../../components/DailyQuote";
import type { TagInfo } from "../../lib/tags";
import TagCloud from "../../components/TagCloud";
import { useRouter } from "next/router";
import { format } from "date-fns";

type Props = { groups: [string, PostMeta[]][], posts: PostMeta[], tags: TagInfo[] };

// 中文注释：归档页，按年份分组，支持折叠。
export default function ArchivesPage({ groups, posts, tags }: Props) {
  const url = canonicalUrl("/archives");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [bgOn, setBgOn] = useState(false);
  const router = useRouter();
  const selectedTag = (router.query.tag as string) || '';

  // 根据选中标签生成分组视图
  const displayGroups = useMemo(() => {
    const source = selectedTag
      ? posts.filter(p => (p.tags || []).includes(selectedTag))
      : posts;
    const gm: Record<string, PostMeta[]> = {};
    source.forEach((p) => {
      const y = new Date(p.date).getFullYear().toString();
      (gm[y] ||= []).push(p);
    });
    Object.keys(gm).forEach((y) => {
      gm[y].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    });
    return Object.keys(gm)
      .sort((a, b) => Number(b) - Number(a))
      .map(y => [y, gm[y]] as [string, PostMeta[]]);
  }, [selectedTag, posts]);

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    setBgOn(localStorage.getItem('bgEffectEnabled') === 'true');
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleBg = () => {
    const enabled = !(localStorage.getItem('bgEffectEnabled') === 'true');
    localStorage.setItem('bgEffectEnabled', String(enabled));
    setBgOn(enabled);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('bg-effect-changed'));
  };

  return (
    <div className="container">
      <Head>
        <title>归档 - {siteConfig.title}</title>
        <link rel="canonical" href={url} />
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
        {/* 标签云（归档页顶部，紧凑小号，无标题） */}
        <section className="tag-cloud tags-cloud-compact">
          <TagCloud tags={tags} limit={80} showCount={true} compact />
        </section>

        <div className="archives-container">
          {displayGroups.map(([year, items]) => (
            <section key={year} className="archive-year">
              <h2 className="archive-year-title">{year} 年</h2>
              <ul className="archive-year-list">
                {items.map((p) => (
                  <li key={p.uuid} className="archive-item">
                    <time className="archive-item-date">{format(new Date(p.date), "MM月dd日")}</time>
                    <Link href={`/post/${p.uuid}`} className="archive-item-title">{p.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
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
  const { getAllPosts, groupPostsByYear } = await import("../../lib/posts");
  const { getAllTags } = await import("../../lib/tags");
  const all = getAllPosts(false).map(({ content, ...meta }) => meta);
  const grouped = groupPostsByYear(all);
  const groups = Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .map((y) => [y, grouped[y]] as [string, PostMeta[]]);
  const tagsRaw = getAllTags();
  const showAll = { name: 'show all', count: all.length, posts: all } as TagInfo;
  const tags = [showAll, ...tagsRaw];
  return { props: { groups, posts: all, tags } };
};
