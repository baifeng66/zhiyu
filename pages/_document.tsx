import Document, { Html, Head, Main, NextScript } from "next/document";
import { siteConfig } from "../lib/site.config";

// 中文注释：自定义 Document 设置 html lang 等。
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang={siteConfig.lang}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

