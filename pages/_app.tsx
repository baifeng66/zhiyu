import type { AppProps } from "next/app";
import Head from "next/head";
import { siteConfig } from "../lib/site.config";
import "../styles/globals.css";
import BackgroundEffects from "../components/BackgroundEffects";

// 中文注释：应用入口，注入全局样式与默认 SEO 元信息。
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={siteConfig.description} />
        <meta name="author" content={siteConfig.author} />
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
        <meta name="theme-color" content="#87CEEB" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><defs><linearGradient id=%22sky%22 x1=%220%25%22 y1=%220%25%22 x2=%220%25%22 y2=%22100%25%22><stop offset=%220%25%22 style=%22stop-color:%2387CEEB%22/><stop offset=%22100%25%22 style=%22stop-color:%23E0F6FF%22/></linearGradient></defs><rect width=%2232%22 height=%2232%22 rx=%226%22 fill=%22url(%23sky)%22/><path d=%22M0 20 Q8 18 16 20 T32 20 L32 32 L0 32 Z%22 fill=%22%234A90E2%22/><ellipse cx=%2216%22 cy=%2222%22 rx=%228%22 ry=%224%22 fill=%22%238B7355%22/><path d=%22M16 8 C14 6 12 6 10 8 C11 10 11 12 10 14 C12 15 14 16 16 16 C18 16 20 15 22 14 C21 12 21 10 22 8 C20 6 18 6 16 8Z%22 fill=%22%23FF6B35%22/><circle cx=%2214%22 cy=%2214%22 r=%220.5%22 fill=%22%23FFD700%22/><circle cx=%2218%22 cy=%2215%22 r=%220.4%22 fill=%22%23FFD700%22/></svg>" />
        <title>{siteConfig.title}</title>
      </Head>
      {/* 背景装饰效果（受本地开关控制） */}
      <BackgroundEffects />
      <Component {...pageProps} />
    </>
  );
}
