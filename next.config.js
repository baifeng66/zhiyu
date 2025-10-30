/**
 * Next.js 基础配置（保持最小化）。
 * 使用 Pages Router，全部页面静态生成（SSG）。
 */
// 中文注释：保持默认即可，必要时可开启 images 或 basePath。
const nextConfig = {
  reactStrictMode: true,
  // 确保静态导出正确工作
  trailingSlash: true,
  // 优化构建
  swcMinify: true,
  // 图片配置
  images: {
    unoptimized: true, // Vercel 部署时可以设置为 false，但静态导出建议设为 true
  },
  // 确保所有页面都静态生成
  generateBuildId: () => 'zhiyu-blog',
};

module.exports = nextConfig;

