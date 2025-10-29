import type { AppProps } from "next/app";
import Head from "next/head";
import { siteConfig } from "../lib/site.config";
import "../styles/globals.css";

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
        <meta name="theme-color" content="#ffffff" />
        <title>{siteConfig.title}</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

