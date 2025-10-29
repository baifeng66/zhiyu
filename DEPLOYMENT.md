# 博客部署指南

## 新增文章的完整流程

### 1. 创建新文章

使用以下命令创建新文章：

```bash
# 基本用法
npm run new-post "文章标题"

# 指定日期
npm run new-post "文章标题" 2025-01-30
```

**示例：**
```bash
npm run new-post "我的第一篇技术博客"
```

**输出示例：**
```
✅ 文章创建成功!
📁 文件路径: content/posts/2025-01-30-wo-de-di-pian-ji-shu-bo-ke.md
🔗 URL: /post/a1b2c3d4
📝 标题: 我的第一篇技术博客
📅 日期: 2025-01-30
🆔 UUID: a1b2c3d4

接下来可以:
1. 编辑文件: /Users/macbookair/codes/minimal-blog/content/posts/2025-01-30-wo-de-di-pian-ji-shu-bo-ke.md
2. 完善文章内容
3. 运行 npm run deploy 部署到服务器
```

### 2. 编辑文章内容

生成的文章会自动包含：
- ✅ 唯一的UUID（用于URL）
- ✅ 基本的文章模板
- ✅ 合理的文件名

你只需要：
1. 编辑Markdown文件，撰写内容
2. 完善frontmatter中的`description`和`tags`字段
3. 设置`draft: false`（默认为false）

### 3. 部署到服务器

编辑完文章后，运行部署命令：

```bash
npm run deploy
```

这个命令会：
1. 自动提交所有更改到Git
2. 构建项目
3. 推送到远程仓库
4. 触发服务器更新（如果配置了CI/CD）

## 服务器部署选项

### 选项一：Vercel（推荐）
1. 连接GitHub仓库到Vercel
2. 自动部署：每次push都会触发更新
3. 零配置，自动SSL

### 选项二：Netlify
1. 连接GitHub仓库到Netlify
2. 设置构建命令：`npm run build`
3. 设置发布目录：`.next`
4. 自动部署：每次push都会触发更新

### 选项三：自建服务器
创建部署脚本 `deploy-to-server.sh`：

```bash
#!/bin/bash
# 本地构建
npm run build

# 上传到服务器
rsync -avz --delete .next/ user@server:/var/www/blog/

# 重启服务器服务
ssh user@server "systemctl reload nginx"
```

## 文章URL结构

- **新格式**: `/post/[uuid]` （例如：`/post/a1b2c3d4`）
- **兼容格式**: `/posts/[slug]` （例如：`/posts/2025-01-30-my-post`）

**推荐使用新格式**，因为：
- ✅ 更简洁的URL
- ✅ 不暴露文件名
- ✅ 更好的隐私性

## 批量操作

### 更新所有文章UUID
如果需要为所有现有文章添加UUID：

```bash
# 谨慎使用！这会修改所有文章文件
node scripts/batch-add-uuid.js
```

### 验证所有文章
检查所有文章是否有有效的UUID：

```bash
node scripts/validate-uuids.js
```

## 故障排除

### 1. UUID冲突
如果生成的UUID已存在，重新运行创建命令：
```bash
npm run new-post "文章标题"
```

### 2. 构建失败
检查文章frontmatter格式：
```yaml
---
title: 文章标题
date: 2025-01-30
uuid: unique-uuid-here
description: 文章描述
tags: [标签1, 标签2]
draft: false
---
```

### 3. 部署失败
- 检查网络连接
- 确认Git远程仓库可访问
- 验证构建命令是否成功

## 最佳实践

1. **定期备份**：定期备份`content/posts/`目录
2. **版本控制**：所有文章都在Git中，可以追踪修改历史
3. **草稿功能**：使用`draft: true`保存未完成的文章
4. **预览功能**：本地运行`npm run dev`预览文章效果
5. **SEO优化**：为每篇文章填写有意义的`description`

## 文件结构

```
minimal-blog/
├── content/posts/          # 文章目录
│   ├── 2025-01-30-post-1.md
│   └── 2025-01-31-post-2.md
├── scripts/               # 工具脚本
│   ├── create-post.js     # 创建文章
│   ├── deploy.sh          # 部署脚本
│   └── generate-feeds.mjs # 生成RSS
├── pages/                 # 页面组件
├── lib/                   # 工具函数
└── public/                # 静态资源
```

现在你可以轻松地创建新文章并部署到服务器了！