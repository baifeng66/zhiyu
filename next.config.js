/**
 * Next.js 配置 - 静态博客
 * 使用 Pages Router，全部页面静态生成（SSG）。
 */
const nextConfig = {
  reactStrictMode: true,
  // 使用 Vercel 默认 Next.js 构建（.next），禁用静态导出
  // 如果需要静态导出到任意静态托管，请改为 `output: 'export'`
  trailingSlash: true,
  // 优化构建
  swcMinify: true,
  // 图片配置：保持默认（如使用 next/image 可启用 Vercel 图片优化）
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
