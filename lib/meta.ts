// 中文注释：SEO 元信息与结构化数据工具函数。
import { siteConfig } from "./site.config";

export function canonicalUrl(pathname: string) {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
  };
}

export function articleJsonLd(opts: {
  title: string;
  description?: string;
  url: string;
  datePublished: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    author: {
      "@type": "Person",
      name: opts.author,
    },
  };
}

