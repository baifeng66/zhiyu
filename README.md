# 知屿（zhiyu）

知屿 - 知识的岛屿，思想的栖息地。极简但功能完备的静态博客，支持UUID URL和自动部署。

## 功能
- 📝 本地 Markdown + Git 提交
- 🏠 首页/文章/归档/关于页面
- 🎨 构建期 Markdown→HTML（GFM、标题锚点、代码高亮）
- 📱 响应式设计 + 明暗主题切换
- 🔗 独特的UUID URL系统（简洁且隐私友好）
- 📈 完整的SEO优化（canonical/OG/JSON-LD）
- 🔙 返回顶部功能（所有页面）
- 📋 文章目录导航
- 📡 RSS（/feed.xml）与 Sitemap（/sitemap.xml）
- 🚀 一键新文章生成 + 自动部署
- 🎯 极简设计，无冗余功能

## 快速开始

### 🚀 自动部署（推荐）
**5分钟搞定博客上线！**

👉 **Vercel**: [QUICK-START.md](QUICK-START.md) → 5分钟部署教程
👉 **Netlify**: [DEPLOY-NETLIFY.md](DEPLOY-NETLIFY.md) → 详细Netlify教程

### 📝 日常使用
```bash
# 创建新文章
npm run new-post "文章标题"

# 编辑文章内容
code content/posts/your-post.md

# 一键部署（推送到GitHub，自动触发构建）
npm run deploy
```

### 💻 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm start
```

## 目录结构
```
minimal-blog/
├── pages/                    # 页面组件
│   ├── index.tsx            # 首页
│   ├── posts/[slug].tsx     # 文章详情（兼容路由）
│   ├── post/[uuid].tsx      # 文章详情（UUID路由）
│   ├── archives/            # 归档页面
│   └── about/               # 关于页面
├── content/posts/           # Markdown 文章
├── lib/                     # 工具函数
│   ├── posts.ts             # 文章处理逻辑
│   ├── uuid.ts              # UUID生成器
│   └── site.config.ts       # 站点配置
├── components/              # React组件
│   └── BackToTop.tsx        # 返回顶部组件
├── scripts/                 # 构建脚本
│   ├── create-post.js       # 文章生成脚本
│   ├── deploy.sh            # 自动部署脚本
│   └── generate-feeds.mjs   # RSS/Sitemap生成
├── public/                  # 静态资源
└── styles/                  # 全局样式
```

## 配置
- 修改 `lib/site.config.ts` 里的站点信息
- 部署前提供环境变量 `SITE_URL`（示例：https://your.xyz）

## 部署到 Vercel
- 连接 Git 仓库 → 一键部署
- 域名绑定：
  - 方案 A（推荐）：将域名 NS 转到 Vercel → 一键接入
  - 方案 B：保留现有 DNS，添加记录
    - CNAME: `www` → `cname.vercel-dns.com`
    - Apex `@`: A/ALIAS 指向 Vercel 提供地址

## 写作规范（Frontmatter）
```yaml
---
title: 文章标题
date: 2025-01-02
description: 文章描述
tags: [标签1, 标签2]
draft: false
uuid: unique-uuid  # 自动生成，也可手动设置
---
```

## 🎯 项目特色

### ✨ 独特的UUID URL系统
- **简洁**: `/post/a1b2c3d4` 而不是 `/posts/2025-01-02-long-title`
- **隐私**: 不暴露文章日期和文件名
- **稳定**: UUID一旦生成不会改变
- **兼容**: 保留原有slug路由确保向后兼容

### 🚀 一键操作
```bash
# 创建新文章（自动生成UUID）
npm run new-post "文章标题"

# 一键部署（自动提交、构建、推送）
npm run deploy
```

### 📱 用户体验
- 响应式设计，移动端友好
- 明暗主题切换
- 返回顶部按钮（所有页面）
- 文章目录导航
- 平滑滚动效果

## 📚 详细文档
- [QUICK-START.md](QUICK-START.md) - 5分钟快速部署
- [DEPLOYMENT.md](DEPLOYMENT.md) - 完整部署指南
- [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md) - Vercel详细教程
- [DEPLOY-NETLIFY.md](DEPLOY-NETLIFY.md) - Netlify详细教程

## 常见问题
- 为什么不用 App Router/Contentlayer？
  - 为了极简与最少依赖；后续需要再平滑升级。
- RSS/Sitemap 如何生成？
  - 构建后脚本 `postbuild` 自动写入到 `public/`。

“保持简单，专注于重要的事”。
# zhiyu
