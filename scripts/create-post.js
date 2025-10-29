#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 简单的UUID生成器（复制lib/uuid.ts的逻辑）
function generateShortUUID() {
  return Math.random().toString(36).substring(2, 10);
}

// 从命令行参数获取标题
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('使用方法: node create-post.js "文章标题" [日期]');
  console.log('示例: node create-post.js "我的新文章" 2025-01-30');
  process.exit(1);
}

const title = args[0];
const date = args[1] || new Date().toISOString().slice(0, 10); // 默认使用今天
const uuid = generateShortUUID();

// 生成文件名（日期 + 标题的拼音/英文）
const slug = `${date}-${title.toLowerCase()
  .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .substring(0, 50)}`;

const fileName = `${slug}.md`;
const filePath = path.join(process.cwd(), 'content', 'posts', fileName);

// 生成文章内容
const content = `---
title: ${title}
date: ${date}
description: ${title} - 一篇新的博客文章
tags: []
draft: false
uuid: ${uuid}
---

# ${title}

在这里开始写你的文章内容...

## 第一节

内容...

## 第二节

内容...

`;

// 检查文件是否已存在
if (fs.existsSync(filePath)) {
  console.log(`❌ 文章已存在: ${fileName}`);
  process.exit(1);
}

// 创建文件
fs.writeFileSync(filePath, content, 'utf8');

console.log(`✅ 文章创建成功!`);
console.log(`📁 文件路径: content/posts/${fileName}`);
console.log(`🔗 URL: /post/${uuid}`);
console.log(`📝 标题: ${title}`);
console.log(`📅 日期: ${date}`);
console.log(`🆔 UUID: ${uuid}`);
console.log('');
console.log('接下来可以:');
console.log(`1. 编辑文件: ${filePath}`);
console.log('2. 完善文章内容');
console.log('3. 运行 npm run build && npm run start 部署到服务器');