/**
 * Next.js 配置 - 静态博客
 * 使用 Pages Router，全部页面静态生成（SSG）。
 */
const nextConfig = {
  reactStrictMode: true,
  // 静态导出配置
  output: 'export',
  // 确保静态导出正确工作
  trailingSlash: true,
  // 优化构建
  swcMinify: true,
  // 图片配置 - 静态导出必须设置
  images: {
    unoptimized: true,
  },
  // 确保所有页面都静态生成
  generateBuildId: () => 'zhiyu-blog',
  // 禁用图片优化以支持静态导出
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;

